import {Qualification} from "./Qualification";

export class Employee
{
  constructor(public id: number = -1,
              public skillSet: Qualification[] = [],
              public lastName?: string,
              public firstName?: string,
              public street?: string,
              public postcode?: string,
              public city?: string,
              public phone?: string)
  {
  }
}
