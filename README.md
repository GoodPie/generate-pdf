# PDF Generation Service

This is a simple PDF generation service built with Node.js, Express, and Puppeteer. It exposes an API endpoint that accepts HTML content and a title, and returns a PDF document.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm or yarn

### Installing

1. Clone the repository:
```bash
git clone <repository_url>
```

2. Navigate to the project directory:
```bash
cd pdf_generation
```

3. Install the dependencies:
```bash
npm install
```
or
```bash
yarn install
```

## Running the Application

Start the server:
```bash
node app.js
```

The server will start on port 4000. You can access it at `http://localhost:4000`.

## API Usage

### Generate PDF

Send a POST request to `http://localhost:4000/generate_pdf` with a JSON body containing `title` and `html` fields. The `html` field should contain the HTML content you want to convert to PDF.

Example:
```json
{
  "title": "Hello World",
  "html": "<h1>Hello World</h1>"
}
```

The server will return a PDF document.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Puppeteer](https://pptr.dev/)

## License

This project is licensed under the MIT License.