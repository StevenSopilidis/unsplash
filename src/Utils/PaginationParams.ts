export class PaginationParams
{
    private readonly maxPageSize = 36;
    private readonly defaultPageNumber = 1;
    private readonly defaultPageSize = 12;
    public currentPage: number;
    public pageSize: number;
    
    constructor(currentPage?: string, pageSize?: string)
    {
        if(!currentPage)
            this.currentPage=this.defaultPageNumber;
        else
            this.currentPage=parseInt(currentPage);
        
        if(!pageSize)
            this.pageSize=this.defaultPageSize;
        else if(parseInt(pageSize) > this.maxPageSize)
            this.pageSize=this.maxPageSize;
        else
            this.pageSize = parseInt(pageSize);
        
    }
}