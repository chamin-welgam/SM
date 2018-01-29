import { HttpClient, HttpParams} from '@angular/common/http';
import * as  AppConfig from  '../app/configuration/config.json';

export class SM_webUtilities {
 // __httpClient: HttpClient;

  constructor(private __httpClient: HttpClient) {
    //   this.__httpClient=_httpClient;
  }
  //
  // function Name: 
  // description:  calling the API/function with funno and data
  //
  callAPIFunction(_funNo:number, _data:object, _callBackFunc, _httpClient :HttpClient=null){
    var _url= (<any>AppConfig).httpCallPath+"/api/function";
   
    var _params = new HttpParams()
      .append('funNo', `${_funNo}`)
      .append('data', `${JSON.stringify(_data)}`);
    if(_httpClient==null) _httpClient=    this.__httpClient
    _httpClient.get(`${_url}`,{params: _params}).subscribe((data : any) => _callBackFunc(data));  
  }
}