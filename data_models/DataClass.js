class DataClass{
    constructor(id) {
        this._id = id
    }

    promiseDecorator(inner){
        return new Promise( async (resolve, reject) => {
            try{
                await inner()
                
                resolve(this)
            } catch(ex) {
                reject(ex)
            }
        });
    }
}

module.exports = DataClass