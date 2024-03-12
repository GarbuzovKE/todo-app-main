export default class ToDoItem{
    constructor(){
        this._id = null;
        this._item = null;
        this._completed = false;
    }

    getId(){
        return this._id;
    }

    setId(id){
        this._id = id;
    }

    getItem(){
        return this._item;
    }

    setItem(item){
        this._item = item;
    }

    changeState(item){
        if (this._completed){
            this._completed = false;
            return;
        }
        this._completed = true;
    }
    
    getState(){
        return this._completed;
    }
} 