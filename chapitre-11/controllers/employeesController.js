const data = {
    employees: require("../model/employees.json"),
    setEmployees: function (data) {this.employees = data}
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id))
    if(!employee){
        return res.status(400).json({"message": `Emplyee ID ${req.params.id} not found.`})
    }
    res.json(employee) 
}

const createNewEmployee = (req, res) => {
    // create new employee object 
    const newEmployee = {
        // On recupere le id du dernier employee ajouter si il en existe un
        // Sinon ca voudra dire que la liste est vide et on demarre a 1 
        id: data.employees[data.employees.length -1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }


    // Si l'utilisateur ne remplie les champs firstname ou lastname alors on retourne un message d'erreur
    if(!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({'message': 'First and last names are required.'})
    }

    // on ajoute le nouvelle employer dans notre liste 
    // 201 : ajout d'un nouvelle element 
    data.setEmployees([...data.employees, newEmployee])
    res.json(data.employees)
}

const updateEmployee = (req, res) => {
    // on verifie d'abord si nous avons un employee avec le meme id passer par l'utilisateur
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message": `Emplyee ID ${req.body.id} not found.`})
    }

    if(req.body.firstname) employee.firstname = req.body.firstname
    if(req.body.lastname) employee.lastname = req.body.lastname

    // On recupere une liste de tous les employees sauf celui qui a ete modifier, on l'a supprimer de la liste  
    const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id))
    // On rajoute la nouvelle version de l'employee, apres modification 
    const unsortedArray = [...filteredArray, employee]
    // On va ensuite trier la liste des employees selon les id
    const sortedArray = unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
    data.setEmployees(sortedArray)
    res.json(data.employees)
    
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message": `Emplyee ID ${req.body.id} not found.`})
    }
    // On recupere une liste de tous les employees sauf celui qui a ete modifier, on l'a supprimer de la liste  
    const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id))
    data.setEmployees([...filteredArray])
    res.json(data.employees)
}


module.exports = {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}
