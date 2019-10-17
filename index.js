const express = require('express');
const app = express();



app.use(express.json());

let contador = 0;


const projetos = [
    {
        id: "1",
        title: "Novo projeto",
        tasks: ["Nova tarefa"]
      }
];

/***
 * MIDDLEWARES
 */

 //Middleware utilizado pelas rotas que recebem ID
function checkProjectExists(req,res,next){
    //const recebe o id do corpo  da requisição
    const proj = req.body.id;
    //se não tiver projeto 
    if(!proj){
        //retorna mensagem de erro 
        return res.status(400).json({error: "ID or Project not found!"});
    }
    //Se passar pelo if vai para o próximo passo
    return next();

}
/**
 * 
 * GLOBAL!!!
 * 
 */
 //Middleware Global console.log( ) conta requisições
app.use((req,res,next)=>{
    //variavel recebe contador mais 1 
    contador += 1;
    //mensagem no log
    console.log(`Numero de requisições : ${contador}`);
    //vai para o próximo passo
    return next();


});

/**
 * 
 * 
 * ROUTES 
 */
//list
app.get('/projects', (req,res) => {
    return res.json(projetos);

});

//Add 
app.post('/projects', (req,res) => {

    //Cria constantes que vão receber o corpo da requisição
    const {id} = req.body;
    const {title} = req.body;
    
    //cria uma constante que retorna um objeto com os dados da requisição
    const projectObj = {
        id,
        title,
        tasks:[]
    };

    //Faz um push no array de projetos
    projetos.push(projectObj);
    // retorna os dados do objeto em JSON 
    return res.json(projectObj);



});

// Add Tasks
app.post('/projects/:id/tasks',checkProjectExists, (req,res) => {

    //informa a rota que ela deve receber um ID como parametro
    const {id} = req.params;

    //recebe um Title no corpo da requisição
    const {title} = req.body;
    //pesquisa se no projeto  existe o id informado
    const projectObj = projetos.find(proj => proj.id == id);
    //const projectObj = projetos.filter(proj => proj.id  == id);
    // Faz um push no objeto  dentro de tasks ddo titulo digitado no corpo da requisição
    projectObj.tasks.push(title);
    // retorna como resposta o resultado da ação acima 
    return res.json(projectObj);
   
});

//Edit / Update
app.put('/projects/:id', checkProjectExists,(req,res) => {
    // const recebe o parametro de id
    const{id} = req.params;
    //requisição do corpo 
    const{title} =req.body;
    //Pesquisa e retornA SE O PROJETO for === ao id da requisição
    const projectObj = projetos.find(proj => proj.id == id);
    
    //insere altera no objjeto title o novo title
    projectObj.title = title;
    //resposta de retorno
    return res.json(projectObj);
});

//Delete object
app.delete('/projects/:id',checkProjectExists, (req,res) => {
    //parametro de ID
    const {id} = req.params;
    //varre o array de projetos e deleta o item ID na posição exata que ele se encontra
    projetos.splice(id,1);
    //mensagem de resposta de sucesso.

    res.send({message:`Projeto deletado com sucesso!!! `});
    
});

app.listen(2000);