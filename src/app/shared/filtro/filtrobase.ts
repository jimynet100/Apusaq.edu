export class FiltroBase {
  //security
  rolId: number;
  pageId: number;
  //configuracion
  queryId: number;
  mapValue;
  url: string;
  //paginacion
  startRow: number;
  endRow: number;
  total: number;
  totalPorPagina: number;
  maxRow: number;/*maximo numero de registros*/
  //propiedades de busqueda genericas
  termino: string;/*termino de busqueda por like*/
  identificador: string;/*id de busqueda por exacta*/
  //indicador de informacion historica
  historico: number;
}
