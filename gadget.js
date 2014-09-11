/**
 * Created by tim on 9/8/14.
 */

var http= require('http');

var gadgets= [
        {id: 1, name: 'Sprung Gadget', springs: 3},
        {id: 2, name: 'Springy Gadget', springs: 10}
    ],
    gadgetMap= {
        1: gadgets[0],
        2: gadgets[1]
    };

function getGadgets(){
    var res= arguments[1],
        next= arguments[2];
    res.send(gadgets);
    next();
}

function getGadget(req,res,next){
    res.send(gadgetMap[req.params.id]);
    next();
}

function createGadget(req,res,next){
    var gadget={
        id: gadgets.length+1,
        name: req.body.name,
        springs: req.body.springs
    };
    gadgets.push(gadget);
    gadgetMap[gadget.id]= gadget;
    res.send(201,gadget);
    next();
}

function updateGadget(req,res,next) {
    var gadget= gadgetMap[req.params.id];
    if(gadget){
        if(req.body.name){
            gadget.name=req.body.name;
        }
        if(req.body.springs){
            gadget.springs=req.body.springs;
        }
        if(req.body.widget){
            gadget.widget=req.body.widget;
            // tell the widget it's associated with a new gadget.
            var json= '';
            function requestCallback(response){
                response.on('end', function(){
                    console.log('Gadget update has updated widget.');
                });
            }
            var request= http.request(
                {host:'localhost', port: 3000, method: 'PUT', path: '/widget/'+ req.body.widget.id,
                    headers:{"Content-Type":"application/json"}},
                requestCallback);
            request.write(JSON.stringify({gadget:{id: req.params.id, link:'/gadget/'+ req.params.id}}));
            request.end();
        }
        res.send(204);
    }else{
        res.send(404);
    }
    next();
}

function deleteGadget(req,res,next) {
    var filterId= req.params.id;
    function filterById(el){
        return el.id!=filterId;
    }
    gadgets= gadgets.filter(filterById);
    delete gadgetMap[filterId];
    res.send(204);
    next();
}

function route(server){
    server.get({name: 'getGadgets', path: '/gadget'},getGadgets);
    server.get({name: 'getGadget', path: '/gadget/:id'},getGadget);
    server.post({name: 'createGadget', path: '/gadget'},createGadget);
    server.del({name: 'deleteGadget', path: '/gadget/:id'},deleteGadget);
    server.put({name: 'updateGadget', path: '/gadget/:id'},updateGadget);
}

exports=module.exports={route:route};