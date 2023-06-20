<?php
namespace App\Models;
use App\Core\Db;

class Model extends Db {
    // Table de la BDD (pour les classes qui hériteront, permet de def le nom de la table)
    protected $table;
    // Instance de DB (permet d'accéder à la connexion à la BDD)
    private $db;


    // CRUD
    public function create($model) {
        $columns = [];
        $values = [];
        $splits = [];

        foreach ($model as $column => $value) { // on sépare clé valeur et on fait autant de ? que d'entrées
            if ($value != null && $column !== "db" && $column !== "table") { // le modele a aussi db et table donc on vire
                $columns[] = "$column";
                $values[] = "$value";
                $splits[] = "?";
            }
        }
        $list_columns = implode(", ", $columns);
        $list_splits = implode(", ", $splits);
        return $this->customQuery("INSERT INTO $this->table ($list_columns) VALUES ($list_splits)", $values);
    }
    public function updateById($model, $id) {
        $fields = [];
        $values = [];

        foreach ($model as $field => $value) { // on bloucle pour séparer clé / valeur ($field clé => $value valeur)
            if ($value != null && $field !== "db" && $field !== "table") { // le modele a aussi db et table donc on vire
                $fields[] = "$field = ?";
                $values[] = "$value";
            }
        }
        $values[] = $id;
        // transofrm fields array in string
        $list_fields = implode(", ", $fields);
        // on execute la requete
        return $this->customQuery("UPDATE $this->table SET $list_fields WHERE id = ?", $values);
    }

    public function deleteById($id) {
        return $this->customQuery("DELETE FROM $this->table WHERE id = ?", [$id]);
    }

    public function findAll() { // tt les données d'une table
        $req = $this->customQuery('SELECT * FROM ' . $this->table);
        return $req->fetchAll();
    }

    public function findBy($filters) { // find data from filter
        $fields = [];
        $values = [];

        foreach ($filters as $field => $value) { // on bloucle pour séparer clé / valeur ($field clé => $value valeur)
            $fields[] = "$field = ?";
            $values[] = "$value";
        }
        // on transfrome tableau fields en chaine de caractères
        $list_fields = implode(' AND ', $fields);
        return $this->customQuery("SELECT * FROM {$this->table} WHERE {$list_fields}", $values)->fetchAll(); // {} pour variable dans une string
    }

    public function findById($id) {
        return $this->customQuery("SELECT * FROM {$this->table} WHERE id = ?", [$id])->fetch();
    }



    public function hydrate($data) { // automatise getter et setter pour des data de formulaires direct par exemple
        foreach ($data as $key => $value) {
            // on recup le nom du setter correspondant a la clé
            // title = settitle par exemple
            $setter = "set".ucfirst($key);
            if(method_exists($this, $setter)) {
                $this->$setter($value);
            }
        }
        return $this;
    }
    
    public function customQuery(string $sql, array $params = null) { // automatiser les requete preparer ou non
        // BDD connect
        $this->db = Db::getInstance();
        // on verif si on a les params
        if ($params !== null) { // param present = requete preparé
            $req = $this->db->prepare($sql);
            $req->execute($params);
            return $req;
        } else { // pas de params = requete normale
            return $this->db->query($sql);
        }
    }
}
