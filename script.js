// Ambil data dari localStorage (kalau ada)
let barangList = JSON.parse(localStorage.getItem("barangList")) || [];
let idCounter = barangList.length ? Math.max(...barangList.map(b => b.id)) + 1 : 1;

// Fungsi untuk menyimpan ke localStorage
function simpanKeLocalStorage() {
  localStorage.setItem("barangList", JSON.stringify(barangList));
}

// Fungsi tambah barang
function tambahBarang() {
  const nama = document.getElementById('namaBarang').value.trim();
  const merek = document.getElementById('merekBarang').value.trim();
  const spesifikasi = document.getElementById('spesifikasiBarang').value.trim();
  const tanggalPembelian = document.getElementById('tanggalPembelian').value;
  const supplier = document.getElementById('supplierBarang').value.trim();
  const hargaBarang = parseFloat(document.getElementById('hargaBarang').value);
  const estimasiJual = parseFloat(document.getElementById('estimasiJual').value);
  const jumlah = parseInt(document.getElementById('jumlahBarang').value);
  const keterangan = document.getElementById('keteranganBarang').value.trim();
  const fileInput = document.getElementById('fotoBarang');
  const file = fileInput.files[0];

  if (!nama || !merek || !spesifikasi || !tanggalPembelian || !supplier ||
      isNaN(hargaBarang) || hargaBarang <= 0 || isNaN(estimasiJual) || estimasiJual <= 0 ||
      isNaN(jumlah) || jumlah <= 0) {
    alert("Isi semua data dengan benar!");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      simpanBarang(nama, merek, spesifikasi, tanggalPembelian, supplier, hargaBarang, estimasiJual, jumlah, keterangan, e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    simpanBarang(nama, merek, spesifikasi, tanggalPembelian, supplier, hargaBarang, estimasiJual, jumlah, keterangan, "https://via.placeholder.com/80");
  }
}

// Simpan barang ke daftar
function simpanBarang(nama, merek, spesifikasi, tanggalPembelian, supplier, hargaBarang, estimasiJual, jumlah, keterangan, foto) {
  const total = jumlah * estimasiJual;
  const barang = {
    id: idCounter++,
    nama,
    merek,
    spesifikasi,
    tanggalPembelian,
    supplier,
    hargaBarang,
    estimasiJual,
    jumlah,
    total,
    keterangan,
    foto,
    tanggalMasuk: new Date().toLocaleString(),
    tanggalKeluar: "-"
  };
  barangList.push(barang);
  simpanKeLocalStorage(); // Simpan ke penyimpanan browser
  renderTabel();
  clearForm();
}

// Bersihkan form setelah tambah data
function clearForm() {
  document.getElementById('namaBarang').value = "";
  document.getElementById('merekBarang').value = "";
  document.getElementById('spesifikasiBarang').value = "";
  document.getElementById('tanggalPembelian').value = "";
  document.getElementById('supplierBarang').value = "";
  document.getElementById('hargaBarang').value = "";
  document.getElementById('estimasiJual').value = "";
  document.getElementById('jumlahBarang').value = "";
  document.getElementById('keteranganBarang').value = "";
  document.getElementById('fotoBarang').value = "";
}

// Barang keluar
function barangKeluar() {
  const id = parseInt(document.getElementById('idKeluar').value);
  const jumlahKeluar = parseInt(document.getElementById('jumlahKeluar').value);
  const barang = barangList.find(b => b.id === id);
  if (!barang) { alert("ID tidak ditemukan!"); return; }
  if (jumlahKeluar > barang.jumlah) { alert("Jumlah keluar melebihi stok!"); return; }

  barang.jumlah -= jumlahKeluar;
  barang.total = barang.jumlah * barang.estimasiJual;
  barang.tanggalKeluar = new Date().toLocaleString();
  simpanKeLocalStorage();
  renderTabel();
  document.getElementById('idKeluar').value = "";
  document.getElementById('jumlahKeluar').value = "";
}

// Tampilkan data di tabel
function renderTabel() {
  const tbody = document.getElementById('tabelBody');
  tbody.innerHTML = "";
  barangList.forEach(b => {
    const row = `
      <tr>
        <td>${b.id}</td>
        <td><img src="${b.foto}" alt="${b.nama}" style="width:80px;height:60px;border-radius:5px;"></td>
        <td>${b.nama}</td>
        <td>${b.merek}</td>
        <td>${b.spesifikasi}</td>
        <td>${b.tanggalPembelian}</td>
        <td>${b.supplier}</td>
        <td>Rp ${b.hargaBarang.toLocaleString()}</td>
        <td>Rp ${b.estimasiJual.toLocaleString()}</td>
        <td>${b.jumlah}</td>
        <td>Rp ${b.total.toLocaleString()}</td>
        <td>${b.keterangan}</td>
        <td>${b.tanggalMasuk}</td>
        <td>${b.tanggalKeluar}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Saat halaman dimuat, tampilkan data dari localStorage
window.onload = renderTabel;
