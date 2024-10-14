import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import { addPublication, getLastPublications, getPublicationsAfterId } from './actions.js';

const app = express()
app.use(express.json())
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));
const port = 3000

app.get('/publications', async (req, res) => {
  try {
    let publications = await getLastPublications();
    res.status(200).send({data: publications});
  } catch (error) {
    console.log(error)
    res.status(500).send({data: []});
  }
})

app.get('/publications-after', async (req, res) => {
  try {
    let publications = await getPublicationsAfterId(req.query.id);
    res.status(200).send({data: publications});
  } catch (error) {
    console.log(error)
    res.status(500).send({data: []});
  }
})

app.post('/publications', async (req, res) => {console.log(req.body)
    try {
      await addPublication(req.body.nom, req.body.texte, req.body.couleur_fond, req.body.couleur_texte);
      res.status(200).send();
    } catch (error) {
      console.log(error)
      res.status(500).send();
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})