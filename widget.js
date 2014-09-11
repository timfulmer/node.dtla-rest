/**
 * Created by tim on 9/8/14.
 */

var widgets= [
        {id: 1, name: 'Super Widget', doodads: 5},
        {id: 2, name: 'Fancy Widget', doodads: 7}
    ],
    widgetMap= {
        1: widgets[0],
        2: widgets[1]
    };

function getWidgets(){
    var res= arguments[1],
        next= arguments[2];
    res.send(widgets);
    next();
}

function getWidget(req,res,next){
    res.send(widgetMap[req.params.id]);
    next();
}

function createWidget(req,res,next){
    var widget={
        id: widgets.length+1,
        name: req.body.name,
        doodads: req.body.doodads
    };
    widgets.push(widget);
    widgetMap[widget.id]= widget;
    res.send(201,widget);
    next();
}

function updateWidget(req,res,next) {
    var widget= widgetMap[req.params.id];
    if(widget){
        if(req.body.name){
            widget.name=req.body.name;
        }
        if(req.body.doodads){
            widget.springs=req.body.springs;
        }
        if(req.body.gadget){
            widget.gadget=req.body.gadget;
        }
        res.send(204);
    }else{
        res.send(404);
    }
    next();
}

function deleteWidget(req,res,next) {
    var filterId= req.params.id;
    function filterById(el){
        return el.id!=filterId;
    }
    widgets= widgets.filter(filterById);
    delete widgetMap[filterId];
    res.send(204);
    next();
}

function route(server){
    server.get('/widget',getWidgets);
    server.get('/widget/:id',getWidget);
    server.post('/widget',createWidget);
    server.del('/widget/:id',deleteWidget);
    server.put('/widget/:id',updateWidget);
}

exports=module.exports={route:route};