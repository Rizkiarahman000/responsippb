const supabase = require('../config/supabase');

const TABLE = 'loans';

const VALID_STATUS = ['Dipinjam', 'Dikembalikan', 'Terlambat'];

function validateBody(body, partial = false) {
  const errors = [];

  if (!partial || body.nama_anggota !== undefined) {
    if (typeof body.nama_anggota !== 'string' || body.nama_anggota.trim() === '') {
      errors.push('nama_anggota wajib diisi (string tidak boleh kosong)');
    }
  }
  if (!partial || body.judul_buku !== undefined) {
    if (typeof body.judul_buku !== 'string' || body.judul_buku.trim() === '') {
      errors.push('judul_buku wajib diisi (string tidak boleh kosong)');
    }
  }
  if (!partial || body.jumlah_buku !== undefined) {
    if (!Number.isInteger(body.jumlah_buku) || body.jumlah_buku < 1) {
      errors.push('jumlah_buku wajib berupa bilangan bulat minimal 1');
    }
  }
  if (!partial || body.tanggal_pinjam !== undefined) {
    if (typeof body.tanggal_pinjam !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.tanggal_pinjam)) {
      errors.push('tanggal_pinjam wajib berformat YYYY-MM-DD');
    }
  }
  if (!partial || body.tanggal_kembali !== undefined) {
    if (typeof body.tanggal_kembali !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.tanggal_kembali)) {
      errors.push('tanggal_kembali wajib berformat YYYY-MM-DD');
    }
  }
  if (!partial || body.status !== undefined) {
    if (!VALID_STATUS.includes(body.status)) {
      errors.push(`status harus salah satu dari: ${VALID_STATUS.join(', ')}`);
    }
  }
  if (body.deskripsi !== undefined && typeof body.deskripsi !== 'string') {
    errors.push('deskripsi harus berupa string');
  }

  return errors;
}

async function getAllLoans(req, res, next) {
  try {
    const { status, nama_anggota, judul_buku } = req.query;

    let query = supabase.from(TABLE).select('*');

    if (status) query = query.eq('status', status);
    if (nama_anggota) query = query.ilike('nama_anggota', `%${nama_anggota}%`);
    if (judul_buku) query = query.ilike('judul_buku', `%${judul_buku}%`);

    const { data, error } = await query.order('tanggal_pinjam', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getLoanById(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
    }
    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createLoan(req, res, next) {
  try {
    const errors = validateBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
    }

    const { nama_anggota, judul_buku, jumlah_buku, tanggal_pinjam, tanggal_kembali, deskripsi, status } = req.body;

    const payload = {
      nama_anggota: nama_anggota.trim(),
      judul_buku: judul_buku.trim(),
      jumlah_buku,
      tanggal_pinjam,
      tanggal_kembali,
      status,
    };
    if (deskripsi !== undefined) payload.deskripsi = deskripsi;

    const { data, error } = await supabase.from(TABLE).insert(payload).select().single();

    if (error) throw error;

    return res.status(201).json({ success: true, message: 'Data peminjaman berhasil dibuat', data });
  } catch (err) {
    next(err);
  }
}

async function updateLoan(req, res, next) {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'Body tidak boleh kosong' });
    }

    const errors = validateBody(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
    }

    const allowed = ['nama_anggota', 'judul_buku', 'jumlah_buku', 'tanggal_pinjam', 'tanggal_kembali', 'deskripsi', 'status'];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        payload[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
      }
    }

    const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
    }
    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Data peminjaman berhasil diperbarui', data });
  } catch (err) {
    next(err);
  }
}

async function deleteLoan(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select().single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
    }
    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Data peminjaman berhasil dihapus', data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
};