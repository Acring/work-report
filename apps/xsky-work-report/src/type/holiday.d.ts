export interface Holiday {
  holiday: boolean;
  name: string;
  wage: number;
  after?: boolean;
  target?: string;
  date: string;
  rest: number;
}

export interface Type {
  type: number;
  name: string;
  week: number;
}

export interface HolidayResponse {
  code: number;
  holiday: {
    [key: string]: Holiday | null;
  };
  type: {
    [key: string]: Type;
  };
}
