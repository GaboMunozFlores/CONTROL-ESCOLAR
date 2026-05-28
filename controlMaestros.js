const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const DATA_FILE = path.join(__dirname, 'data', 'maestros.json');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readData() {
	try {
		const content = await fs.readFile(DATA_FILE, 'utf8');
		return JSON.parse(content || '[]');
	} catch (err) {
		if (err.code === 'ENOENT') return [];
		throw err;
	}
}

async function writeData(data) {
	await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
	await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/maestros', async (req, res) => {
	const maestros = await readData();
	res.json(maestros);
});

app.get('/api/maestros/:id', async (req, res) => {
	const maestros = await readData();
	const maestro = maestros.find(m => String(m.id) === String(req.params.id));
	if (!maestro) return res.status(404).json({ error: 'Maestro no encontrado' });
	res.json(maestro);
});

app.post('/api/maestros', async (req, res) => {
	const maestros = await readData();
	const { nombre, email, asignatura } = req.body;
	if (!nombre || !email) return res.status(400).json({ error: 'Faltan campos' });
	const id = maestros.length ? Math.max(...maestros.map(m => m.id)) + 1 : 1;
	const nuevo = { id, nombre, email, asignatura: asignatura || '' };
	maestros.push(nuevo);
	await writeData(maestros);
	res.status(201).json(nuevo);
});

app.put('/api/maestros/:id', async (req, res) => {
	const maestros = await readData();
	const idx = maestros.findIndex(m => String(m.id) === String(req.params.id));
	if (idx === -1) return res.status(404).json({ error: 'Maestro no encontrado' });
	const { nombre, email, asignatura } = req.body;
	maestros[idx] = { ...maestros[idx], nombre, email, asignatura };
	await writeData(maestros);
	res.json(maestros[idx]);
});

app.delete('/api/maestros/:id', async (req, res) => {
	let maestros = await readData();
	const id = String(req.params.id);
	const exists = maestros.some(m => String(m.id) === id);
	if (!exists) return res.status(404).json({ error: 'Maestro no encontrado' });
	maestros = maestros.filter(m => String(m.id) !== id);
	await writeData(maestros);
	res.json({ success: true });
});

app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

