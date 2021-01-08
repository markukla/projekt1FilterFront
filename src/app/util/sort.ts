export class Sort {

  private sortOrder = 1;
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  constructor() { }

  // tslint:disable-next-line:typedef
  public startSort(property, order, type = '') {
    console.log('in start sort');
    if (order === 'desc') {
      this.sortOrder = -1;
    }
    return (a, b) => {
    /*  const aSplited = a[property].split('.');
      const ayear: number = Number(aSplited[2]);
      const aMonth: number = Number(aSplited[1]) - 1;
      const aDay: number = Number(aSplited[0]);
      const bSplited = b[property].split('.');
      const byear: number = Number(bSplited[2]);
      const bMonth: number = Number(bSplited[1]) - 1;
      const bDay: number = Number(bSplited[0]);

      if (type === 'date') {
        return this.sortData(new Date(ayear, aMonth, aDay), new Date(byear, bMonth, bDay));
      } else {
        return this.collator.compare(a[property], b[property]) * this.sortOrder;
      }
    }; */
      if (type === 'date') {
        return this.sortData(new Date(a[property]), new Date(b[property]));
      } else {
        return this.collator.compare(a[property], b[property]) * this.sortOrder;
      }
    };
  }

  // tslint:disable-next-line:typedef
  private sortData(a, b) {
    if (a < b) {
      return -1 * this.sortOrder;
    } else if (a > b) {
      return 1 * this.sortOrder;
    } else {
      return 0 * this.sortOrder;
    }
  }
}
