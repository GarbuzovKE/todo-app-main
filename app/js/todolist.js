export default class ToDoList {
  constructor() {
    this._list = [];
  }

  getList() {
    return this._list;
  }

  clearCompleted() {
    const list = this._list;
    for (let i = list.length-1; i>=0; i--){
      if (list[i].getState()){
        list.splice(i, 1);
      }
    }
  }

  addItemToList(itemObj) {
    this._list.push(itemObj);
  }

  unshiftItemToList(itemObj){
    this._list.unshift(itemObj);
  }

  removeItemFromList(id) {
    const list = this._list;
    for (let i = 0; i < list.length; i++) {
        if (list[i]._id == id){
            list.splice(i, 1);
            break;
        }
    }
  }
}
