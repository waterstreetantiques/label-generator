// Centralized print label CSS for both AdminPage and ProductForm
const printLabelStyles = `
  @page {
    size: 4in 6in;
    margin: 0.75in 0;
  }
  body {
    margin: 0;
    padding: 0.125in;
    width: 3.75in;
    height: 5.75in;
    overflow: hidden;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 2;
    color: black;
    background: white;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  .label-header {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.5;
  }
  .label-small {
    font-size: 12px;
    line-height: 1.5;
  }
  .chakra-box {
    border: 2px solid black;
    border-radius: 8px;
    padding: 12px;
    height: 100%;
    box-sizing: border-box;
  }
  .chakra-text {
    margin: 0;
  }
  .label-bold, .chakra-text[style*="font-weight: bold"], .chakra-text[style*="font-weight:bold"] {
    font-weight: bold !important;
  }
  p[style*="font-weight: bold"], p[style*="font-weight:bold"],
  span[style*="font-weight: bold"], span[style*="font-weight:bold"],
  div[style*="font-weight: bold"], div[style*="font-weight:bold"] {
    font-weight: bold !important;
  }
  .chakra-divider {
    border-color: black;
    margin: 6px 0;
  }
  .chakra-table {
    width: 100%;
    border-collapse: collapse;
    text-align:left;
    line-height: 1.5;
  }
  .chakra-table th,
  .chakra-table td {
    padding: 0px;
    font-size: 14px;
  }
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }
`;

export default printLabelStyles;
