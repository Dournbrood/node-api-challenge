const express = require("express");

const server = express();

const helmet = require("helmet");
const morgan = require("morgan");

//Databases!
const ProjectDB = require("../data/helpers/projectModel");
const ActionDB = require("../data/helpers/actionModel");

//The three QoL amigos.
server.use(express.json());
server.use(helmet());
server.use(morgan("common"));

//Logger, if I write one.
server.use(logger);

//GET to /api/projects
server.get("/api/projects", (request, response) => {
    ProjectDB.get()
        .then((projects) => {
            response.status(200).json({ ...projects });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//POST to /api/projects
server.post("/api/projects", (request, response) => {
    ProjectDB.insert(request.body)
        .then((newProject) => {
            response.status(201).json({ ...newProject });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//PUT to /api/projects
server.put("/api/projects", validateProjectID, validateProject, (request, response) => {
    const { project_id, ...rest } = request.body;

    console.log("uhh, here's stuff: ", project_id, rest);

    ProjectDB.update(project_id, rest)
        .then((updatedProject) => {
            response.status(201).json({ ...updatedProject });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//DELETE to /api/projects

server.delete("/api/projects", validateProjectID, (request, response) => {
    ProjectDB.remove(request.body.project_id)
        .then((recordsDeleted) => {
            response.status(200).json({ message: `Successfully deleted ${recordsDeleted} records.` });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//GET to /api/actions
server.get("/api/actions", validateActionID, (request, response) => {
    ActionDB.get()
        .then((actions) => {
            response.status(200).json({ ...actions });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//POST to /api/actions
server.post("/api/actions", validateAction, (request, response) => {
    ActionDB.insert(request.body)
        .then((newAction) => {
            response.status(201).json({ ...newAction });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//PUT to /api/actions
server.put("/api/actions", validateProjectID, validateActionID, validateAction, (request, response) => {
    const { id, ...rest } = request.body;
    ActionDB.update(id, rest)
        .then((updatedAction) => {
            response.status(200).json({ ...updatedAction });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//DELETE to /api/actions
server.delete("/api/actions", validateActionID, (request, response) => {
    ActionDB.remove(request.body.id)
        .then((recordsDeleted) => {
            response.status(200).json({ message: `Successfully deleted ${recordsDeleted} records.` });
        })
        .catch((error) => {
            console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
            response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
        })
})

//Custom middleware goes here
function logger(request, response, next) {
    const { method, url, body, params } = request;
    console.log(`\n *** ~${method} REQUEST TO ${url} AT [${Date.now()}]~ *** \n`);
    console.log("\nREQUEST BODY: ", body, "\nREQUEST PARAMS: ", params);
    next();
}

//VALIDATION SCHEMA! YAYUH!
function validateProjectID(request, response, next) {
    if (request.body !== undefined && request.body.project_id) {
        ProjectDB.get(request.body.project_id)
            .then((projectFound) => {
                if (projectFound) {
                    next();
                }
                else {
                    response.status(404).json({ message: "A project with the given ID does not exist!" })
                }
            })
            .catch((error) => {
                console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
                response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
            })
    }
    else {
        response.send("Please provide a valid Project ID with your request!");
    }
}

function validateProject(request, response, next) {
    if (request.body !== undefined && request.body.name && request.body.description) {
        next();
    }
    else {
        response.send("Please provide a name and description property with your request!");
    }
}

function validateActionID(request, response, next) {
    if (request.body !== undefined && request.body.id) {
        ActionDB.get(request.body.id)
            .then((actionFound) => {
                if (actionFound) {
                    next();
                }
                else {
                    response.status(404).json({ message: "An action with the given ID does not exist!" })
                }
            })
            .catch((error) => {
                console.log("\n\n !!! ~ *** INTERNAL SERVER ERROR! *** ~ !!! \n\n", error);
                response.status(500).json({ message: "There was an internal error processing your request. Please scream at the devs until they fix this." });
            })
    }
    else {
        response.send("Please provide a valid Action ID with your request!");
    }
}

function validateAction(request, response, next) {
    if (request.body !== undefined && request.body.description && request.body.notes && request.body.project_id) {
        next();
    }
    else {
        response.send("Please provide a Project ID, description and notes property in your request!")
    }
}

module.exports = server;