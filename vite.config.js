import path from 'path';
import fs from 'fs'; // Import fs module
import checker from 'vite-plugin-checker';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { generateInvoice } from './generateInvoice';

// ----------------------------------------------------------------------

const PORT = 3030;

const env = loadEnv('all', process.cwd());

function getAllInvoices() {
  const invoicesDir = path.resolve(__dirname, 'mockServer');
  const files = fs.readdirSync(invoicesDir).filter(file => file.endsWith('.json'));

  return files.map(file => {
    const filePath = path.join(invoicesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  });
}

function saveInvoice(data) {
  const invoicesDir = path.resolve(__dirname, 'mockServer');
  const invoice=generateInvoice(data.invoiceParameter)
  const filePath = path.join(invoicesDir, `${invoice.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(invoice, null, 2));
  return invoice.id
}

// Create a custom middleware to serve mock data
function mockServerPlugin() {
  return {
    name: 'mock-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        const invoiceId = url.startsWith('/api/') ? url.substring(5) : '';

        if (url.startsWith('/api/')) {
          if (req.method === 'GET') {
            if (invoiceId === 'all') {
              // Serve a list of all invoices
              const allInvoices = getAllInvoices();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(allInvoices));
            } else {
              // Serve individual invoice data
              const filePath = path.resolve(__dirname, 'mockServer', `${invoiceId}.json`);
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/json');
                fs.createReadStream(filePath)
                  .on('error', () => {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                  })
                  .pipe(res);
              } else {
                res.statusCode = 404;
                res.end('Not Found');
              }
            }
          } else if (req.method === 'POST') {
            if (url === '/api/invoices') {
              // Create a new invoice
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString(); // Convert Buffer to string
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  console.log(data,'data')
                
                  const id=saveInvoice(data);
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ id }));
                } catch (error) {
                  res.statusCode = 400;
                  res.end('Invalid JSON');
                }
              });
            } else {
              res.statusCode = 404;
              res.end('Not Found');
            }
          } else {
            res.statusCode = 405; // Method Not Allowed
            res.end('Method Not Allowed');
          }
        } else {
          next();
        }
      });
    }
  };
}



export default defineConfig({
  // base: env.VITE_BASE_PATH,
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
    mockServerPlugin(), // Add the mockServerPlugin here
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
});
