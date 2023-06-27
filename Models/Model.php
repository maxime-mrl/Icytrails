<?php
namespace App\Models;
use App\Core\Db;

class Model extends Db {
    protected $table;
    // db instance
    private $db;


    /* -------------------------------------------------------------------------- */
    /*                                    CRUD                                    */
    /* -------------------------------------------------------------------------- */
    public function create($model) {
        $columns = [];
        $values = [];
        $splits = [];

        foreach ($model as $column => $value) {
            if ($value !== null && $column !== "db" && $column !== "table") { // since we have the whole model we remove table and db
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

        foreach ($model as $field => $value) {
            if ($value !== null && $field !== "db" && $field !== "table") { // since we have the whole model we remove table and db
                $fields[] = "$field = ?";
                $values[] = "$value";
            }
        }
        $values[] = $id;
        // transofrm fields array in string
        $list_fields = implode(", ", $fields);
        return $this->customQuery("UPDATE $this->table SET $list_fields WHERE id = ?", $values);
    }

    public function deleteById($id) { // delete element by id
        return $this->customQuery("DELETE FROM $this->table WHERE id = ?", [$id]);
    }

    public function findAll() { // find all data
        $req = $this->customQuery('SELECT * FROM ' . $this->table);
        return $req->fetchAll();
    }

    public function findBy($filters) { // find data from filter
        $fields = [];
        $values = [];
        // create fields string and filters (value) for a prepared request
        foreach ($filters as $field => $value) {
            $fields[] = "$field = ?";
            $values[] = "$value";
        }
        $list_fields = implode(' AND ', $fields);
        return $this->customQuery("SELECT * FROM {$this->table} WHERE {$list_fields}", $values)->fetchAll();
    }

    public function findById($id) {
        return $this->customQuery("SELECT * FROM {$this->table} WHERE id = ?", [$id])->fetch();
    }

    public function hydrate($data) { // hydrate models by settings all value we get at once
        foreach ($data as $key => $value) {
            $setter = "set".ucfirst($key);
            if(method_exists($this, $setter)) {
                $this->$setter($value);
            }
        }
        return $this;
    }
    
    public function customQuery(string $sql, array $params = null) { // automate request
        // DB connect
        $this->db = Db::getInstance();
        // check if we have params
        if ($params !== null) { // param present = prepare
            $req = $this->db->prepare($sql);
            $req->execute($params);
            return $req;
        } else { // no params = normal
            return $this->db->query($sql);
        }
    }
}
