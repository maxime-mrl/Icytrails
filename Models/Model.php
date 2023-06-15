<?php
namespace App\Models;
use App\Core\Db;

class Model extends Db {
    // for herited classes allow to set the wnated table
    protected $table;
    private $db;


    // CRUD
    public function findAll() {
        $req = $this->customQuery('SELECT * FROM ' . $this->table);
        return $req->fetchAll();
    }

    public function findBy(array $filters) {
        $fields = [];
        $values = [];

        foreach ($filters as $field => $value) { // itterate to split keys/values ($field:keys => $value:value)
            $fields[] = "$field = ?";
            $values[] = "$value";
        }
        // transform $fields array to a string
        $list_fields = implode(' AND ', $fields);
        return $this->customQuery("SELECT * FROM $this->table WHERE $list_fields", $values)->fetchAll();
    }

    public function findById(int $id) { return $this->customQuery("SELECT * FROM $this->table WHERE id = ?", [$id])->fetchAll(); }

    public function insert($params) {
        $columns = [];
        $values = [];
        $prepare = [];

        foreach ($params as $column => $value) {
            $columns[] = "$column";
            $values[] = "$value";
            $prepare[] = "?";
        }
        $list_columns = implode(", ", $columns);
        $list_prepare = implode(", ", $prepare);
        // return ["INSERT INTO $this->table($list_columns) VALUES ($list_prepare)", $values];
        return $this->customQuery("INSERT INTO $this->table($list_columns) VALUES ($list_prepare)", $values);
    }


    
    public function customQuery(string $sql, array $params = null) { // simplify request (prepare or not)
        // BDD connect
        $this->db = Db::getInstance();
        // if we have params need to prepare else basic request
        if ($params !== null) { // params -> prepare
            $req = $this->db->prepare($sql);
            $req->execute($params);
            return $req;
        } else { // no params -> basic
            return $this->db->query($sql);
        }
    }
}
