import { getLogger } from "./logger.util";
import { isFullDefined } from "./json.util";

const logger = getLogger("RequestUtil");

/**
 * Funcion que retorna un objeto JSON con la estructura header para un servicio BUS banco estado.
 * @param {String} serviceName nombre de servicio bus que se desea invocar
 * @param {Request} req es el request de la peticion de entrada al microservicio
 * @return {JOSN} header para request de servicios SOAP BUS
 */
export function busSoapRequestBuilder(serviceName, req) {
  let {
    "funcionalidad-app": funcionalidadApp,
    "canal-app": canalApp,
    "session-id": sessionId,
    rut,
    dv,
    agencia,
    "user-agent": userAgent,
    "user-ip-adress": userIpAdress
  } = req.headers;
  let now = new Date().getMilliseconds;
  let busSoapRequest = {
    ServiceId: serviceName,
    Type: "Request",
    InstitutionType: "BECH",
    FeatureId: funcionalidadApp,
    ChannelId: canalApp,
    BranchId: agencia || "001",
    TerminalId: userAgent,
    TimeStamp: now,
    Client: {
      UserAgent: userAgent,
      Address: userIpAdress || '',
      SessionId: sessionId,
      UserId: rut && dv ? `${rut}${dv}` : undefined
    }
  };
  return busSoapRequest;
}
