export const numberWithCommas = (x:any) => {
    var formatter = new Intl.NumberFormat('en-US');
      return formatter.format(x);
}

export const formatDollar = (amount:any) => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      });
      return formatter.format(amount);
}

export const displayAddress = (addr:string) => {
    let x = addr.substring(0, 8) + "..." + addr.substring(addr.length-6);
    return x;
}