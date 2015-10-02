module.exports = {
  url: 'mongodb://localhost/cqsocialtest1'
};


/*
  Document for mongodb in commands line:
    mongo                               (start mongo command)
    show dbs                            (show all databases)
    use db <dbname>                     (switch to specific db)
    db                                  (object of database, use it to query)
    show collections                    (show all collections on db <-> table on sql)
    db.collectionName
      .insert({})                       (insert document into collection)
      .find().forEach(printjson)        (print all doc on collections, printjson => easy to see)
      .save(data)                       (save with new data and update with existing data)
      .remove({key: value})             (remove doc with group of key value matched)

*/
