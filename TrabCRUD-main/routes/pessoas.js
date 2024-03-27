// routes/pessoas.js

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Pessoa = require('../models/Pessoa');
const { cpf } = require('cpf-cnpj-validator');

// Rota para listar todas as pessoas
router.get('/', async (req, res) => {
  try {
    const pessoas = await Pessoa.findAll();
    res.json(pessoas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar uma nova pessoa
router.post('/', async (req, res) => {
  try {
    const novaPessoa = req.body;
    if (!cpf.isValid(novaPessoa.cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }
    const pessoa = await Pessoa.create(novaPessoa);
    res.status(201).json(pessoa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para filtrar por CPF
router.get('/filtro/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const pessoa = await Pessoa.findOne({ where: { cpf } });
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    res.json(pessoa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar uma pessoa existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const novosDados = req.body;

  try {
    // Verifica se o CPF é válido antes de atualizar
    if (novosDados.cpf && !cpf.isValid(novosDados.cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    // Atualiza a pessoa no banco de dados
    const pessoa = await Pessoa.findByPk(id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }
    await pessoa.update(novosDados);

    res.json(pessoa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para excluir uma pessoa
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Encontra a pessoa no banco de dados
    const pessoa = await Pessoa.findByPk(id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada' });
    }

    // Exclui a pessoa do banco de dados
    await pessoa.destroy();

    res.json({ message: 'Pessoa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
