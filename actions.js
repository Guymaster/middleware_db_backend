import Client from "pg";

function getDbMiddleware(){
    return new Client.Client({
        host: "localhost",
        database: "biharbook",
        user: "postgres",
        password: "postgres"
    });
}

export async function getPublicationsAfterId(id = 0) {
    const dbMiddleware = getDbMiddleware();
    try {
        const query = "SELECT * FROM publication WHERE id > '" + id + "' ORDER BY timestamp DESC";
        const values = [];
        await dbMiddleware.connect();
        const res = await dbMiddleware.query(query, values);
        await dbMiddleware.end();
        return res.rows;
    } catch (err) {
        console.error('Erreur lors de la récupération des publications', err);
        throw err;
    }
}

export async function getLastPublications(limit = 10) {
    const dbMiddleware = getDbMiddleware();
    try {
        const query = 'SELECT * FROM publication ORDER BY timestamp DESC LIMIT $1';
        const values = [limit];
        await dbMiddleware.connect();
        const res = await dbMiddleware.query(query, values);
        await dbMiddleware.end();
        return res.rows;
    } catch (err) {
        console.error('Erreur lors de la récupération des publications', err);
        throw err;
    }
}

export async function addPublication(nom, texte, couleur_fond, couleur_texte) {
    const dbMiddleware = getDbMiddleware();
    try {
        const query = `
        INSERT INTO publication (nom, texte, couleur_fond, couleur_texte)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;
        const values = [nom?? "", texte?? "", couleur_fond?? "#000000", couleur_texte?? "#FFFFFF"];
        await dbMiddleware.connect();
        const res = await dbMiddleware.query(query, values);
        await dbMiddleware.end();
        return res.rows[0]; // Renvoie la publication ajoutée
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la publication', err);
        throw err;
    }
}