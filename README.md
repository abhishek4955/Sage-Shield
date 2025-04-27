# Sage Shield - DDoS Detection Tool

A real-time DDoS detection and mitigation system with a modern React frontend and Flask backend.

## Features

- 🔍 Real-time network traffic monitoring
- 🚫 Automatic DDoS attack detection
- 🛡️ IP blocking and management
- 📊 Live traffic visualization
- 🌓 Dark/Light theme support
- 🔄 Auto-scaling capabilities
- 📱 Responsive design

## Features in Detail

### Network Monitoring
- Real-time traffic analysis
- Request rate monitoring
- Bandwidth usage tracking
- Source IP tracking

### DDoS Protection
- Anomaly detection
- Automatic IP blocking
- Manual IP management
- Scalable resources

### User Interface
- Clean, modern design
- Dark/Light theme
- Real-time updates
- Responsive layout

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for development
- Lucide React for icons

### Backend
- Flask (Python)
- boto3 for AWS integration
- scikit-learn for anomaly detection
- Flask-CORS for cross-origin support

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- AWS credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhishek-khadse/DDOS-TOOL.git
cd sage-shield
```

2. Set up the backend:
```bash
cd ddos_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the ddos_backend directory:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
```

### Running the Application

1. Start the backend server:
```bash
cd ddos_backend
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

## Project Structure

```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React for the frontend framework
- Flask for the backend framework
- AWS for cloud infrastructure
- Tailwind CSS for styling
