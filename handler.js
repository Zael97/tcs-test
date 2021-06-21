'use strict';
const querystring = require('querystring');
const axios = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const options = {
  headers:{
    'Allow-Origin':'*'
  }
}

module.exports.getFilm = async (event) => {
  try{
    const response = await dynamo.get({TableName: "tcs-films", Key:{id: event.pathParameters.id}}).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }catch(err){
    return {
      statusCode: 400,
      body: JSON.stringify({msg: 'Algo salió mal'})
    }
  };
};

module.exports.getPlanet = async (event) => {
  try{
    const response =await axios.get(`https://swapi.py4e.com/api/planets/${event.pathParameters.id}/`, options);
    const data = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        nombre: data.name,
        periodio_rotacion:data.rotation_period,
        periodo_orbital: data.orbital_period,
        diametro: data.diameter,
        clima: data.climate,
        gravedad: data.gravity,
        terreno: data.terrain,
        superficie_acuatica: data.surface_water,
        poblacion: data.population,
        residentes: data.residents,
        peliculas: data.films,
        creado: data.created,
        editado: data.edited,
        enlace: data.url
      }),
    };
  }catch(err){
    return {statusCode:400, body: JSON.stringify({msg:'Algo salió mal'})};
  }
};


module.exports.createFilm = async (event) => {
  try{
    const body = JSON.parse(event.body);
    const item = {
      id: uuid.v1(),
      titulo: body.title,
      episodio: body.episode_id,
      apertura: body.opening_id,
      director: body.director,
      productor: body.productor,
      fecha_lanzamiento: body.release_date,
      personajes: body.characters,
      planetas: body.planets,
      naves: body.starships,
      vehiculos: body.vehicles,
      especies: body.species,
      creado: body.created,
      editado: body.edited,
      enlace: body.url
  } 
    await dynamo.put({
      TableName: "tcs-films",
      Item: item}).promise();
      return {statusCode: 200, body: JSON.stringify(item)};
  }catch(err){
    return {statusCode: 400, body: JSON.stringify({msg: err})};
  }
};