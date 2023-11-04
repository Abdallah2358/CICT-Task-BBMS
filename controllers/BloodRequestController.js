
// returns list view of resource
const index = (req, res, next) => {
    res.render('blood-request/index', { title: 'Blood Request' });
}

// returns single view of a resource
const show = (req, res, next) => {
    res.render('blood-request/show', { title: 'Blood Request' });
}

// returns create view for a resource
const create = (req, res, next) => {
    res.render('blood-request/create', { title: 'Blood Request', errors: {} });
}

// handles priesting the resource in the database
// may redirect to another action or return the status with errors if any 
const store = (req, res, next) => {
    //if  errors
    //   res.render('blood-request/create', { title: 'Blood Request' , errors:{} });
    //else
    //db.model.create ({req.body})  

}

// returns edit view for a resource
const edit = (req, res, next) => { }

// handles priesting updates to resource in the database
// may redirect to another action or return the status with errors if any 
const update = (req, res, next) => { }

// handles deleting a resource from database
// may redirect to another action or return the status with errors if any 
// we only added action here because the `delete` is a js keyword
const deleteAction = (req, res, next) => { }

module.exports = {
    index,
    show,
    create,
    store,
    edit,
    update,
    deleteAction
};