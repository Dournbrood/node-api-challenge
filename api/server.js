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

