class APIFeatures{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach(field => delete queryObj[field])
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else{
            this.mongooseQuery.sort("-createdAt")
        }
        return this;
    }
    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }else{
            this.mongooseQuery.select('-__v');
        }
        return this;
    }
    paginate(countDocuments){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        let pagination = {};
        let endPageIndex = page * limit;
        pagination.currentPage =page;
        pagination.limit = limit;

        pagination.numberOfPages = Math.ceil(countDocuments/ limit);
        if(endPageIndex < countDocuments){
            pagination.next = page + 1;
        }
        if(skip > 1){
            pagination.previous = page -1;
        }
        
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;

        return this;
    }
}

module.exports = APIFeatures;