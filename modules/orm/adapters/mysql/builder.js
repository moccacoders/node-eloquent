import adapter from './index'

export default class Builder {
	constructor(options, model) {
		this.options = options
		this.model = model
	}

	join(includeTable, localField, operator, remoteField, type = "INNER"){
		if(!["=", "<", ">", "!=", "<>", "<=", ">=", "<=>"].includes(operator)){
			if(remoteField) type = remoteField;
			remoteField = operator;
			operator = "=";
		}
		let join = {
			includeTable,
			localField,
			operator,
			remoteField,
			type : type.toUpperCase()
		};
		if(this.options.joins)
			this.options.joins.push(join)
		else this.options.joins = [join]
		if(this.options.joins[0] !== true) this.options.joins.splice(0,0,true);
		return this;
	}

	orderBy(orderBy){
		this.options.orderBy = orderBy
		return this;
	}

	offset(offset){
		this.options.offset = offset
		return this;
	}

	limit(limit) {
		this.options.limit = limit
		return this
	}

	select(...select) {
		this.options.select = select
		return this
	}

	where(where) {
		if(typeof where == "object")
			Object.entries(where).map(obj => {
				let [key, val] = obj;
				delete where[key];
				where[`${key.search(/\./i) < 0 ? `${this.options.model.getTableName}.` : ""}${key}`] = val;
			});

		if(this.options.where){
			if(!this.options.where[0])
				this.options.where = [this.options.where];
			this.options.where.push(where);
		}else
			this.options.where = where;
		return this
	}

	orWhere(orWhere) {
		if(typeof orWhere == "object")
			Object.entries(orWhere).map(obj => {
				let [key, val] = obj;
				delete orWhere[key];
				orWhere[`${key.search(/\./i) < 0 ? `${this.options.model.getTableName}.` : ""}${key}`] = val;
			})

		if(this.options.orWhere){
			if(!this.options.orWhere[0])
				this.options.orWhere = [this.options.orWhere];
			this.options.orWhere.push(orWhere);
		}else
			this.options.orWhere = orWhere;
		return this
	}

	set(data) {
		this.options.data = data
		return this;
	}

	first() {
		this.options.limit = 1
		return this.get()
	}

	firstSync() {
		this.options.sync = true;
		this.options.limit = 1
		this.options.first = true
		return this.get()
	}

	all() {
		return adapter.select(this.options, this.model)
	}

	allSync() {
		this.options.sync = true;
		return adapter.select(this.options, this.model)
	}

	get() {
		return adapter.select(this.options, this.model)
	}

	getSync() {
		this.options.sync = true;
		return adapter.select(this.options, this.model)
	}

	toSql() {
		this.options.toSql = true;
		return this.get();
	}

	update() {
		return adapter.update(this.options, this.model)
	}

	updateSync() {
		return adapter.updateSync(this.options, this.model)
	}

	count() {
		this.options.select = `COUNT(${this.options.model.primaryKey}) as count`
		let result = adapter.select(this.options, this.model);
		return result;
	}

	countSync() {
		this.options.sync = true;
		this.options.select = `COUNT(${this.options.model.primaryKey}) as count`
		let result = adapter.select(this.options, this.model);
		return result;
	}

	with(...relationships) {
		let joins = {};
		relationships.map(rel => {
			let relationship = this.options.model;
			relationship = new relationship();
			return joins[rel] = relationship[rel](this);
		})

		this.options.joins = joins;
		return this;
	}
}
