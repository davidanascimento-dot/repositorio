const express = require('express');
const supabase = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
  const { nome, tipo, marca, problema, status } = req.body;


  if (!nome || !tipo || !marca || !problema) {
    return res.status(400).json({
      erro: 'Os campos nome, tipo, marca e problema são obrigatórios.'
    });
  }

  const { data, error } = await supabase
    .from('equipamentos')
    .insert([{
      nome,
      tipo,
      marca,
      problema,
      status: status || 'Em análise'
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.status(201).json({
    mensagem: 'Equipamento cadastrado com sucesso!',
    equipamento: data
  });
});


router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.json(data);
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  if (!data) {
    return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
  }

  return res.json(data);
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, marca, problema, status } = req.body;

  const { data: existente } = await supabase
    .from('equipamentos')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!existente) {
    return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
  }

  const { data, error } = await supabase
    .from('equipamentos')
    .update({ nome, tipo, marca, problema, status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.json({
    mensagem: 'Equipamento atualizado com sucesso!',
    equipamento: data
  });
});



router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: existente } = await supabase
    .from('equipamentos')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!existente) {
    return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
  }

  const { error } = await supabase
    .from('equipamentos')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.json({ mensagem: 'Equipamento excluído com sucesso!' });
});

module.exports = router;