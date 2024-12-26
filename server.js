const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// MongoDB bağlantı URL'si
const dbURI = 'mongodb+srv://sznburak55:123@cluster0.6sfae.mongodb.net/messages?retryWrites=true&w=majority';

// MongoDB'ye bağlan
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.log('MongoDB bağlantısı hatası:', err));

const app = express();
const port = 3000;

// CORS ayarları
app.use(cors());
app.use(express.json());

// Public klasörünü statik dosyalar için kullan
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB modelini tanımlayın
const contactSchema = new mongoose.Schema({
  mesajisim: String,
  mesajmail: String,
  mesajkonu: String,
});

// Burada 'contact' koleksiyonuna yönlendiriyoruz
const Contact = mongoose.model('Contact', contactSchema, 'contact');

// Verileri listelemek için API route'u (verileri fetch ile almak için kullanabilirsiniz)
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.log('Veri getirilemedi:', err);
    res.status(500).json({ message: 'Veri getirilemedi' });
  }
});

// Veriyi silmek için API route'u
app.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Veri bulunamadı' });
    }
    res.json({ message: 'Veri başarıyla silindi' });
  } catch (err) {
    console.log('Veri silerken hata oluştu:', err);
    res.status(500).json({ message: 'Veri silinemedi' });
  }
});

// Veriyi güncellemek için API route'u
app.put('/contacts/:id', async (req, res) => {
  const { mesajisim, mesajmail, mesajkonu } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { mesajisim, mesajmail, mesajkonu },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Veri bulunamadı' });
    }
    res.json(updatedContact);
  } catch (err) {
    console.log('Veri güncellerken hata oluştu:', err);
    res.status(500).json({ message: 'Veri güncellenemedi' });
  }
});

// Kök route üzerinden index.html'i sunma
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend çalışıyor: http://localhost:${port}`);
});
