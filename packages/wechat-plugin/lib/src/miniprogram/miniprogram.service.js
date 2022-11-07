"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniProgramService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
class MiniProgramService {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger(MiniProgramService.name);
    }
    /**
     * 获取接口调用凭据
     *
     * 获取小程序全局唯一后台接口调用凭据，token有效期为7200s，开发者需要进行妥善保存。
     *
     * @param appId
     * @param secret
     * @returns
     */
    getAccessToken(appId, secret) {
        if (!appId || !secret) {
            appId = this.options?.appId;
            secret = this.options?.secret;
        }
        const url = 'https://api.weixin.qq.com/cgi-bin/token';
        // eslint-disable-next-line camelcase
        return axios_1.default.get(url, { params: { grant_type: 'client_credential', appid: appId, secret } });
    }
    /**
     * 查询rid信息
     * @param {string} rid
     * @param {string} accessToken
     * @returns
     * @link https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/openApi/get_rid_info.html
     */
    getRid(rid, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/openapi/rid/get?access_token=${accessToken}`;
        return axios_1.default.post(url, {
            rid,
        });
    }
    /**
     * 获取插件用户openpid
     *
     * 通过 wx.pluginLogin 接口获得插件用户标志凭证 code 后传到开发者服务器，开发者服务器调用此接口换取插件用户的唯一标识 openpid。
     *
     * @param {string} code
     * @param {string} accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/basic-info/getPluginOpenPId.html
     */
    getPluginOpenPId(code, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/getpluginopenpid?access_token=${accessToken}`;
        return axios_1.default.post(url, {
            code,
        });
    }
    /**
     * 登录
     * @param code 临时登录凭证
     * @param appId 小程序 appId
     * @param secret 小程序 appSecret
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
     */
    async code2Session(code, appId, secret) {
        if (!appId || !secret) {
            appId = this.options?.appId;
            secret = this.options?.secret;
        }
        if (!appId || !secret) {
            throw new Error(`${MiniProgramService.name}': No appId or secret.`);
        }
        else {
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
            return (await axios_1.default.get(url)).data;
        }
    }
    /**
     * 获取手机号
     * @param {string} accessToken 小程序调用token，第三方可通过使用authorizer_access_token代商家进行调用
     * @param {string} code 手机号获取凭证，小程序端获取
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html
     * @link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
     */
    getPhoneNumber(code, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
        return axios_1.default.post(url, { code });
    }
    /**
     *
     * 获取小程序码
     *
     * 该接口用于获取小程序码，适用于需要的码数量较少的业务场景。通过该接口生成的小程序码，永久有效，有数量限制，详见获取小程序码。
     *
     * + 如果调用成功，会直接返回图片二进制内容，如果请求失败，会返回 JSON 格式的数据。
     * + POST 参数需要转成 JSON 字符串，不支持 form 表单提交。
     * + 接口只能生成已发布的小程序码
     * + 与 createQRCode 总共生成的码数量限制为 100,000，请谨慎调用。
     *
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getQRCode.html
     */
    getQRCode(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     *
     * 获取不限制的小程序码
     *
     * 获取小程序码，适用于需要的码数量极多的业务场景。通过该接口生成的小程序码，永久有效，数量暂无限制。
     * @param accessToken
     * @link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
     * @deprecated 统一方法名，请使用 #getUnlimitedQRCode
     */
    getUnlimited(accessToken, params) {
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 获取不限制的小程序码
     *
     * 该接口用于获取小程序码，适用于需要的码数量极多的业务场景。通过该接口生成的小程序码，永久有效，数量暂无限制。 更多用法详见 获取小程序码。
     *
     * 注意事项
     * + 如果调用成功，会直接返回图片二进制内容，如果请求失败，会返回 JSON 格式的数据。
     * + POST 参数需要转成 JSON 字符串，不支持 form 表单提交。
     * + 接口只能生成已发布的小程序码
     * + 调用分钟频率受限（5000次/分钟），如需大量小程序码，建议预生成
     *
     * 获取 scene 值
     * + scene 字段的值会作为 query 参数传递给小程序/小游戏。用户扫描该码进入小程序/小游戏后，开发者可以获取到二维码中的 scene 值，再做处理逻辑。
     * + 调试阶段可以使用开发工具的条件编译自定义参数 scene=xxxx 进行模拟，开发工具模拟时的 scene 的参数值需要进行 encodeURIComponent
     *
     * @param params
     * @param accessToken
     * @returns
     */
    getUnlimitedQRCode(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 获取小程序二维码
     *
     * 获取小程序二维码，适用于需要的码数量较少的业务场景。通过该接口生成的小程序码，永久有效，有数量限制，详见获取二维码。
     *
     * 注意事项
     *
     * + POST 参数需要转成 JSON 字符串，不支持 form 表单提交。
     * + 接口只能生成已发布的小程序的二维码。开发版的带参二维码可以在开发者工具预览时生成。
     * + 与 wxacode.get 总共生成的码数量限制为 100,000，请谨慎调用。
     *
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/createQRCode.html
     */
    createQRCode(params, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=n=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 查询 scheme 码
     *
     * 该接口用于查询小程序 scheme 码，及长期有效 quota。
     *
     * @param scheme
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-scheme/queryScheme.html
     */
    queryScheme(scheme, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/queryscheme?access_token=${accessToken}`;
        return axios_1.default.post(url, { scheme });
    }
    /**
     * 获取 scheme 码
     *
     * 该接口用于获取小程序 scheme 码，适用于短信、邮件、外部网页、微信内等拉起小程序的业务场景。通过该接口，可以选择生成到期失效和永久有效的小程序码，有数量限制，目前仅针对国内非个人主体的小程序开放，详见获取 URL scheme。
     *
     * 调用上限
     *
     * Scheme 将根据是否为到期有效与失效时间参数，分为短期有效 Scheme 与长期有效Scheme：
     * + 单个小程序每日生成 Scheme 上限为50万个（包含短期有效 Scheme 与长期有效 Scheme）
     * + 有效时间超过180天的 Scheme 或永久有效的 Scheme 为长期有效Scheme，单个小程序总共可生成长期有效 Scheme 上限为10万个，请谨慎调用
     * + 有效时间不超过180天的 Scheme 为短期有效Scheme，单个小程序生成短期有效 Scheme 不设上限
     *
     * 其他注意事项
     * + 微信内的网页如需打开小程序请使用微信开放标签 - 小程序跳转按钮，无公众号也可以直接使用小程序身份开发网页并免鉴权跳转小程序，见云开发静态网站跳转小程序。符合开放范围的小程序可以下发支持打开小程序的短信
     * + 该功能基本覆盖当前用户正在使用的微信版本，开发者无需进行低版本兼容
     * + 只能生成已发布的小程序的 URL Scheme
     * + 通过 URL Scheme 跳转到微信时，可能会触发系统弹框询问，若用户选择不跳转，则无法打开小程序。请开发者妥善处理用户选择不跳转的场景
     * + 部分浏览器会限制打开网页直接跳转，可参考示例网页设置跳转按钮
     *
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-scheme/generateScheme.html
     */
    generateScheme(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 获取 NFC 的小程序 scheme
     *
     * 该接口用于获取用于 NFC 的小程序 scheme 码，适用于 NFC 拉起小程序的业务场景。目前仅针对国内非个人主体的小程序开放，详见 NFC 标签打开小程序。
     *
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-scheme/generateNFCScheme.html
     */
    generateNFCScheme(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/generatenfcscheme?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 获取 URL Link
     *
     * 获取小程序 URL Link，适用于短信、邮件、网页、微信内等拉起小程序的业务场景。通过该接口，可以选择生成到期失效和永久有效的小程序链接，有数量限制，目前仅针对国内非个人主体的小程序开放，详见获取 URL Link
     *
     * 调用上限
     *
     * Link 将根据是否为到期有效与失效时间参数，分为短期有效Link 与 长期有效Link：
     * + 单个小程序每日生成 Link 上限为50万个（包含短期有效 Link 与长期有效 Link ）
     * + 有效时间超过180天的 Link 或永久有效的 Link 为长期有效Link，单个小程序总共可生成长期有效 Link 上限为10万个，请谨慎调用
     * + 有效时间不超过180天的 Link 为短期有效Link，单个小程序生成短期有效 Link 不设上限
     *
     * 返回值说明
     * + 如果调用成功，会直接返回生成的小程序 URL Link。如果请求失败，会返回 JSON 格式的数据。
     *
     * 其他注意事项
     * + 只能生成已发布的小程序的 URL Link。
     * + 在微信内或者安卓手机打开 URL Link 时，默认会先跳转官方 H5 中间页，如果需要定制 H5 内容，可以使用云开发静态网站。
     *
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-link/generateUrlLink.html
     */
    generateUrlLink(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/generate_urllink?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 查询 URL Link
     *
     * 该接口用于查询小程序 url_link 配置，及长期有效 quota
     *
     * @param urlLink
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-link/queryUrlLink.html
     */
    queryUrlLink(urlLink, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/query_urllink?access_token=${accessToken}`;
        // eslint-disable-next-line camelcase
        return axios_1.default.post(url, { url_link: urlLink });
    }
    /**
     * 获取 Short Link
     *
     * 获取小程序 Short Link，适用于微信内拉起小程序的业务场景。目前只开放给电商类目(具体包含以下一级类目：电商平台、商家自营、跨境电商)。通过该接口，可以选择生成到期失效和永久有效的小程序短链，详见获取 Short Link。
     *
     * 调用上限
     *
     * Link 将根据是否为到期有效与失效时间参数，分为**短期有效ShortLink ** 与 **永久有效ShortLink **：
     *
     * + 单个小程序每日生成 ShortLink 上限为50万个（包含短期有效 ShortLink 与长期有效 ShortLink ）
     * + 单个小程序总共可生成永久有效 ShortLink 上限为10万个，请谨慎调用。
     * + 短期有效ShortLink 有效时间为30天，单个小程序生成短期有效ShortLink 不设上限。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/short-link/generateShortLink.html
     */
    generateShortLink(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxa/genwxashortlink?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 下发统一消息
     *
     * 该接口用于下发小程序和公众号统一的服务消息。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/uniform-message/sendUniformMessage.html
     */
    sendUniformMessage(params, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 创建activity_id
     *
     * 该接口用于创建被分享动态消息或私密消息的 activity_id。详见动态消息。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/updatable-message/createActivityId.html
     */
    createActivityId(params, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/activityid/create?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 修改动态消息
     *
     * 该接口用于修改被分享的动态消息。详见动态消息。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/updatable-message/setUpdatableMsg.html
     */
    setUpdatableMsg(params, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/updatablemsg/send?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 删除模板
     *
     * 该接口用于删除帐号下的个人模板。
     *
     * @param priTmplId
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/deleteMessageTemplate.html
     */
    deleteMessageTemplate(priTmplId, accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/deltemplate?access_token=${accessToken}`;
        return axios_1.default.post(url, { priTmplId });
    }
    /**
     * 获取类目
     *
     * 该接口用于获取小程序账号的类目。
     *
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/getCategory.html
     */
    getCategory(accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getcategory?access_token=${accessToken}`;
        return axios_1.default.get(url);
    }
    /**
     * 获取关键词列表
     *
     * 该接口用于获取模板标题下的关键词列表。
     *
     * @param tid
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/getPubTemplateKeyWordsById.html
     */
    getPubTemplateKeyWordsById(tid, accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatekeywords?access_token=${accessToken}&tid=${tid}`;
        return axios_1.default.get(url);
    }
    /**
     * 获取所属类目下的公共模板
     *
     * 该接口用于获取帐号所属类目下的公共模板标题。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/getPubTemplateTitleList.html
     */
    getPubTemplateTitleList(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatetitles?access_token=${accessToken}&ids=${params.ids}&start=${params.start}&limit=${params.limit}`;
        return axios_1.default.get(url);
    }
    /**
     * 获取个人模板列表
     *
     * 该接口用于获取当前帐号下的个人模板列表。
     *
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/getMessageTemplateList.html
     */
    getMessageTemplateList(accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/gettemplate?access_token=${accessToken}`;
        return axios_1.default.get(url);
    }
    /**
     * 发送订阅消息
     *
     * 该接口用于发送订阅消息。
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/sendMessage.html
     */
    sendMessage(params, accessToken) {
        const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 添加模板
     *
     * 该接口用于组合模板并添加至帐号下的个人模板库。
     *
     * @param params
     * @param accessToken
     * @returns
     * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/addMessageTemplate.html
     */
    addMessageTemplate(params, accessToken) {
        const url = `https://api.weixin.qq.com/wxaapi/newtmpl/addtemplate?access_token=${accessToken}`;
        return axios_1.default.post(url, params);
    }
    /**
     * 小程序消息推送配置时，推送处理方法
     * @param req Express.Request
     * @param res Express.Response，当res有传时，会调用send响应微信服务器
     * @param token 小程序token，默认使用service实例化时的token，
     * @returns string | false 验证通过时，返回echostr，验证不通过时，返回false
     * @link https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/message-push.html
     */
    verifyMessagePush(req, res, token) {
        token = token || this.options?.token;
        this.logger.debug(`verifyMessagePush() token = ${token}`);
        this.logger.debug(`verifyMessagePush() query = ${JSON.stringify(req.query)}`);
        const signature = (req.query && req.query.signature) || '';
        const timestamp = (req.query && req.query.timestamp) || '';
        const nonce = (req.query && req.query.nonce) || '';
        const echostr = (req.query && req.query.echostr) || '';
        const my = utils_1.MessageCrypto.sha1(token || '', timestamp, nonce);
        if (my === signature) {
            if (res && typeof res.send === 'function') {
                res.send(echostr);
            }
            return echostr;
        }
        else {
            if (res && typeof res.send === 'function') {
                res.send('fail');
            }
            return false;
        }
    }
}
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Object)
], MiniProgramService.prototype, "verifyMessagePush", null);
exports.MiniProgramService = MiniProgramService;
