import {
  ServiceType,
  GET_CID_LIST,
  CREATE_ACCOUNT,
  GET_ACCOUNT_LIST,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_ACCOUNT,
} from './constant';
import { AccessToken } from './accesstoken';
import { Properties, ClientInfo } from './properties';
import {
  getResponseMessageConstant,
  EMPTY_CLIENT_INFO,
  EMPTY_PUBLIC_KEY,
} from './messageconstant';
import { execute, requestToken } from './connector';

/**
 * 코드에프의 쉬운 사용을 위한 유틸 라이브러리 클래스
 */
export class EasyCodef {
  private properties: Properties;
  private accessToken: AccessToken;

  constructor() {
    this.properties = new Properties();
    this.accessToken = new AccessToken();
  }

  /**
   * RSA 암호화를 위한 퍼블릭키 설정
   * @param key
   */
  setPublicKey(publickey: string) {
    this.properties.setPublicKey(publickey);
  }

  /**
   *  RSA암호화를 위한 퍼블릭키
   */
  getPublicKey(): string {
    return this.properties.getPublicKey();
  }

  /**
   * 정식서버 사용을 위한 클라이언트 정보 설정
   * @param realClientId
   * @param realClientSecret
   */
  setClientInfo(clientID: string, clientSecret: string) {
    this.properties.setClientInfo(clientID, clientSecret);
  }

  /**
   * 데모서버 사용을 위한 클라이언트 정보 설정
   * @param demoClientId
   * @param demoClientSecret
   */
  setClientInfoForDemo(clientID: string, clientSecret: string) {
    this.properties.setDemoClientInfo(clientID, clientSecret);
  }

  /**
   * 서비스별 토큰 설정
   * @param serviceType
   * @param token
   */
  setAccessToken(serviceType: ServiceType, token: string) {
    this.accessToken.setToken(serviceType, token);
  }

  /**
   * 서비스별 토큰 가져오기
   * @param serviceType
   */
  getAccessToken(serviceType: ServiceType): string {
    return this.accessToken.getToken(serviceType);
  }

  /**
   * 클라이언트 정보 조회
   * @param {*} serviceType
   */
  getClientInfo(serviceType: ServiceType): ClientInfo {
    return this.properties.getClientInfo(serviceType);
  }

  /**
   * 서비스 타입에 따른 클라이언트 정보 설정 확인
   * @returns {boolean}
   */
  private checkClientInfo(serviceType: ServiceType): boolean {
    const { clientID, clientSecret } = this.getClientInfo(serviceType);
    return !!(clientID && clientSecret);
  }

  /**
   * 상품 요청 URL
   * @param serviceType
   * @param productURL
   * @returns {string}
   */
  getProductRequestURL(serviceType: ServiceType, productURL: string): string {
    return this.properties.getProductRequestURL(serviceType, productURL);
  }

  /**
   * 상품 요청
   * @param productURL
   * @param serviceType
   * @param parameterMap
   */
  requestProduct(
    productURL: string,
    serviceType: ServiceType,
    param: any
  ): Promise<string> {
    // 1.필수 항목 체크 - 클라이언트 정보
    if (!this.checkClientInfo(serviceType)) {
      return new Promise((resolve) =>
        resolve(getResponseMessageConstant(EMPTY_CLIENT_INFO))
      );
    }
    // 2.필수 항목 체크 - 퍼블릭 키
    if (!this.getPublicKey()) {
      return new Promise((resolve) =>
        resolve(getResponseMessageConstant(EMPTY_PUBLIC_KEY))
      );
    }

    return execute(this, serviceType, productURL, param);
  }

  /**
   * 서비스별 (정식/데모/샌드박스)토큰발급 요청
   * @param serviceType
   */
  requestToken(serviceType: ServiceType): Promise<string> {
    return requestToken(serviceType, this);
  }

  /**
   * 서비스별 계정 목록 조회
   * @param serviceType
   * @param paramMap
   */
  getConnectedIdList(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(GET_CID_LIST, serviceType, param);
  }

  /**
   * connectedId 발급을 위한 계정 등록
   * @param serviceType
   * @param paramMap
   */
  createAccount(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(CREATE_ACCOUNT, serviceType, param);
  }

  /**
   * connectedId로 등록된 계정 목록 조회
   * @param serviceType
   * @param paramMap
   */
  getAccountList(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(GET_ACCOUNT_LIST, serviceType, param);
  }

  /**
   *  계정 정보 추가
   * @param serviceType
   * @param param
   */
  addAccount(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(ADD_ACCOUNT, serviceType, param);
  }

  /**
   *  계정 정보 삭제
   * @param serviceType
   * @param param
   */
  deleteAccount(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(DELETE_ACCOUNT, serviceType, param);
  }

  /**
   * Comment  : 계정 정보 수정
   * @param serviceType
   * @param param
   */
  updateAccount(serviceType: ServiceType, param: any): Promise<string> {
    return this.requestProduct(UPDATE_ACCOUNT, serviceType, param);
  }
}