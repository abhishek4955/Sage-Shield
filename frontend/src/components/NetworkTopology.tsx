import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkConnection, ConnectionStatus, NodeStatus } from '../types';

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'server' | 'cloud' | 'switch' | 'pc';
  status: NodeStatus;
  connections: number;
}

interface NetworkLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  status: ConnectionStatus;
  bandwidth: number;
}

interface NetworkTopologyProps {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  width?: number;
  height?: number;
}

const getStatusColor = (status: ConnectionStatus | NodeStatus): string => {
  switch (status) {
    case 'active': return '#22c55e';
    case 'warning': return '#eab308';
    case 'error': return '#ef4444';
    case 'idle':
    case 'inactive': return '#94a3b8';
    default: return '#94a3b8';
  }
};

const getNodeIcon = (type: string): string => {
  switch (type) {
    case 'cloud': return 'M3,13 L3,12 C3,9.23858 5.23858,7 8,7 C10.7614,7 13,9.23858 13,12 L13,13 L14,13 C15.6569,13 17,14.3431 17,16 C17,17.6569 15.6569,19 14,19 L6,19 C4.34315,19 3,17.6569 3,16 L3,13 Z';
    case 'switch': return 'M4,7 L20,7 L20,17 L4,17 L4,7 Z M6,9 L6,15 L18,15 L18,9 L6,9 Z';
    case 'server': return 'M4,4 L20,4 L20,20 L4,20 L4,4 Z M6,6 L6,18 L18,18 L18,6 L6,6 Z M8,8 L16,8 L16,10 L8,10 L8,8 Z M8,12 L16,12 L16,14 L8,14 L8,12 Z';
    case 'pc': return 'M4,4 L20,4 L20,16 L4,16 L4,4 Z M6,6 L6,14 L18,14 L18,6 L6,6 Z M8,17 L16,17 L16,20 L8,20 L8,17 Z';
    default: return '';
  }
};

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  nodes,
  connections,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, NetworkLink> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Clear previous simulation if it exists
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Create container for zoom
    const container = svg.append('g');

    // Create arrow marker for links
    svg.append('defs').selectAll('marker')
      .data(['active', 'warning', 'error', 'idle'] as ConnectionStatus[])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', d => getStatusColor(d))
      .attr('d', 'M0,-5L10,0L0,5');

    // Convert nodes and links to simulation format
    const simNodes = nodes.map(node => ({ ...node })) as SimNode[];
    const simLinks = connections.map(conn => ({ ...conn })) as NetworkLink[];

    // Create the simulation with adjusted forces
    simulationRef.current = d3.forceSimulation<SimNode>()
      .nodes(simNodes)
      .force('link', d3.forceLink<SimNode, NetworkLink>(simLinks)
        .id(d => d.id)
        .distance(100)
        .strength(1))
      .force('charge', d3.forceManyBody()
        .strength(-800)
        .distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Create the links with arrows
    const link = container
      .append('g')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', d => getStatusColor(d.status))
      .attr('stroke-width', d => Math.max(1, Math.min(5, Math.log(d.bandwidth) / 2)))
      .attr('marker-end', d => `url(#arrow-${d.status})`);

    // Create node containers
    const node = container
      .append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add node circles with gradient
    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => {
        const gradient = svg.append('defs')
          .append('radialGradient')
          .attr('id', `gradient-${d.id}`);
        
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', getStatusColor(d.status))
          .attr('stop-opacity', 0.7);
        
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', getStatusColor(d.status))
          .attr('stop-opacity', 0.3);
        
        return `url(#gradient-${d.id})`;
      })
      .attr('stroke', d => getStatusColor(d.status))
      .attr('stroke-width', 2);

    // Add node icons
    node.append('path')
      .attr('d', d => getNodeIcon(d.type))
      .attr('fill', 'white')
      .attr('transform', 'translate(-10, -10) scale(1)')
      .style('pointer-events', 'none');

    // Add node labels
    node.append('text')
      .text(d => d.name)
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium')
      .style('pointer-events', 'none')
      .attr('fill', 'currentColor');

    // Update positions on each tick
    simulationRef.current.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x || 0)
        .attr('y1', d => (d.source as SimNode).y || 0)
        .attr('x2', d => (d.target as SimNode).x || 0)
        .attr('y2', d => (d.target as SimNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active && simulationRef.current) {
        simulationRef.current.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active && simulationRef.current) {
        simulationRef.current.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [nodes, connections, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full bg-background"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};
