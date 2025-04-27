/// <reference types="react" />
/// <reference types="lucide-react" />

import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Shield, Code2, Database, Network } from 'lucide-react';

export function About() {
  const technologies = [
    { name: 'Security Monitoring', icon: Shield, description: 'Real-time threat detection and response' },
    { name: 'Advanced Analytics', icon: Code2, description: 'Powerful data analysis and visualization' },
    { name: 'Network Management', icon: Network, description: 'Comprehensive network control and monitoring' },
    { name: 'Data Processing', icon: Database, description: 'Efficient handling of security data' },
  ];

  const teamMembers = [
    {
      name: 'Abhishek Khadse',
      role: 'Backend Developer',
      bio: 'Expert  in backend development and system architecture.',
      image: '/images/1st member.png',
    },
    {
      name: 'Harsh Patil',
      role: 'Researcher',
      bio: 'Specialized in security research and threat analysis.',
      image: '/images/2nd Member.png',
    },
    {
      name: 'Omkar Kardile',
      role: 'Frontend Developer',
      bio: 'Creating beautiful and responsive user interfaces.',
      image: '/images/3rd member .png',
    },
    {
      name: 'Vinay Zunja',
      role: 'Documentation Specialist',
      bio: 'Ensuring clear and comprehensive project documentation.',
      image: '/images/4th Member .png',
    },
    {
      name: 'Milind Bhagawat',
      role: 'Project Manager',
      bio: 'Leading the team with expertise in project coordination and delivery.',
      image: undefined,
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* About the Project */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">About Sage Shield</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Sage Shield is a comprehensive network security monitoring system designed
              to protect modern infrastructure from emerging threats. Our platform
              combines real-time analysis, machine learning, and expert systems to
              provide robust security solutions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-2">
                    <tech.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{tech.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000"
              alt="Network Security"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="rounded-lg border bg-card p-6">
          <ol className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </span>
              <div>
                <h3 className="font-medium">Network Monitoring</h3>
                <p className="text-muted-foreground">
                  Continuous monitoring of network traffic and system activities
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </span>
              <div>
                <h3 className="font-medium">Threat Detection</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms identify potential security threats
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </span>
              <div>
                <h3 className="font-medium">Automated Response</h3>
                <p className="text-muted-foreground">
                  Immediate action taken to mitigate identified threats
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Team Members */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Meet the Team</h2>
        
        {/* First Team Member - Centered */}
        <div className="flex justify-center mb-8">
          <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg w-96">
            <div className="flex flex-col items-center">
              <div className="mb-4 overflow-hidden rounded-full w-40 h-40 flex items-center justify-center">
                <img
                  src={teamMembers[0].image}
                  alt={teamMembers[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium text-center">{teamMembers[0].name}</h3>
              <p className="text-lg text-primary text-center">{teamMembers[0].role}</p>
              <p className="mt-2 text-muted-foreground text-center">{teamMembers[0].bio}</p>
              <div className="mt-4 flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Other Team Members */}
        <div className="grid gap-6 md:grid-cols-2">
          {teamMembers.slice(1).map((member) => (
            <div
              key={member.name}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 overflow-hidden rounded-full w-32 h-32 flex items-center justify-center bg-muted">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">👤</span>
                  )}
                </div>
                <h3 className="text-xl font-medium text-center">{member.name}</h3>
                <p className="text-sm text-primary text-center">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground text-center">{member.bio}</p>
                <div className="mt-4 flex space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Group */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Our Group</h2>
        <div className="rounded-lg border bg-card">
          <div className="grid md:grid-cols-2">
            <div className="p-6">
              <h3 className="text-xl font-medium">Sage Shield Team</h3>
              <p className="mt-2 text-muted-foreground">
                A dedicated group of developers and security enthusiasts working together
                to create innovative solutions for network security and monitoring.
                Our diverse team brings together expertise in backend development,
                research, frontend design, and project management.
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden md:rounded-r-lg">
              <img
                src="/images/PHOTO 8585012.jpg"
                alt="Sage Shield Team"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 