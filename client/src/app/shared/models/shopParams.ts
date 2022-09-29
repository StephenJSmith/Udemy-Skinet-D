export class ShopParams {
  brandId = 0;
  typeId = 0;
  sort = 'name';
  search: string;
  
  pageNumber = 1;
  pageSize = 6;
  totalCount = 0;

  get pageFrom(): number {
    const result = this.totalCount === 0
      ? 0
      : ((this.pageNumber - 1) * this.pageSize) + 1;

    return result;
  }

  get pageTo(): number {
    const result = Math.min(
      this.totalCount, 
      this.pageNumber * this.pageSize);

    return result; 
  }

  get pageFromTo(): string {
    return `${this.pageFrom} - ${this.pageTo}`;
  }

  get canShowItems(): boolean {
    return this.totalCount > 0;
  }
}
