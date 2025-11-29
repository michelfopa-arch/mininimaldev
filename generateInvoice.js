import { v4 as uuidv4 } from 'uuid';

function getMonthSentence(monthNumber) {
  const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const monthName = months[monthNumber - 1];

  return `For the month of ${monthName} ${currentYear}`;
}

function generateInvoiceNumber(monthNumber) {
  // Hardcode the starting digit
  const startingDigit = 'INV-1';

  const formattedMonth = monthNumber.toString().padStart(2, '0');

  const currentYear = new Date().getFullYear();
  
  const lastTwoDigitsOfYear = currentYear.toString().slice(-2);

  // Generate the invoice number
  const invoiceNumber = `${startingDigit}${lastTwoDigitsOfYear}${formattedMonth}`;

  return invoiceNumber;
}

function getDueDate() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine the next month and year
  const nextMonth = (currentMonth + 1) % 12;
  const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear;

  // Create a new date for the 15th of the next month
  const dueDate = new Date(nextMonthYear, nextMonth, 15);

  // Convert to ISO string format
  return dueDate.toISOString();
}




export function generateInvoice(token) {
  const parts = token.split('-');
  const quantity = parseInt(parts[0], 10);
   const month = parseInt(parts[1], 10);
   const price=53.82;

  const subtotal = (quantity * price).toFixed(2)
  const invoice = {
    id: uuidv4(), // Generate a unique ID for the invoice
    taxes: 0,
    status: "pending",
    //discount: discount, // Use the provided discount value
    //shipping: 20.54,
    subtotal: subtotal,
    totalAmount: subtotal,
    items: [
      {
        id: uuidv4(), // Generate a unique ID for each item
        total: subtotal,
        title: "IT Consultancy Services",
        description: getMonthSentence(month),
        price,
        service: "CEO",
        quantity
      },
    ],
    invoiceNumber: generateInvoiceNumber(month),
    invoiceFrom: {
      id: uuidv4(), // Generate a unique ID for the invoiceFrom
      primary: false,
      name: "14080319 Canada Inc.",
      email: "michelfopa@gmail.com",
      fullAddress: "34 LionHead Golf Club Road",
      fullAddressLine2: "Bramption, ON",
      fullAddressLine3: "Canada",
      phoneNumber: "+1 514 943 92 84",
      company: "14080319 Canada Inc.",
      addressType: "Office",
      taxeId:"#HST:724172903RT0001"
    },
    invoiceTo: {
      id: uuidv4(), // Generate a unique ID for the invoiceTo
      primary: false,
      name: "HANALYTICA GmbH",
    //  email: "hanalytica@getmyinvoices.net",
      email:"adis.hodzic@hanalytica.com",
      fullAddress: "Aignerweg 11",
      fullAddressLine2: "4048 Puchenau/Linz",
      fullAddressLine3: "Austria",
      phoneNumber: "+43 650 4605482",
      company: "HANALYTICA GmbH",
      addressType: "Office",
      taxeId:"VAT: ATU79826823"
    },
    sent: 4,
    createDate: new Date().toISOString(), // Current date in ISO format
    dueDate: getDueDate()
  };

  return invoice;
}

