const express = require('express');
const cors = require('cors');

const loansRoutes = require('./routes/loans');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Selamat datang di REST API Pencatatan Peminjaman Buku Perpustakaan',
    endpoints: {
      health: 'GET /health',
      listLoans: 'GET /loans',
      filterLoans: 'GET /loans?status=Terlambat',
      detailLoan: 'GET /loans/:id',
      createLoan: 'POST /loans',
      updateLoan: 'PUT /loans/:id',
      deleteLoan: 'DELETE /loans/:id',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API berjalan normal' });
});

app.use('/loans', loansRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
  });
});

module.exports = app;