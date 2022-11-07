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
exports.ScraperResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const scraper_service_1 = require("./scraper.service");
const core_1 = require("@picker-cc/core");
const got_1 = __importDefault(require("got"));
let ScraperResolver = class ScraperResolver {
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async scraperMeta(ctx, args) {
        const { body: html, url: uri } = await (0, got_1.default)(args.url);
        return this.scraperService.scrapeMetadata(uri, html);
    }
};
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, core_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ScraperResolver.prototype, "scraperMeta", null);
ScraperResolver = __decorate([
    (0, graphql_1.Resolver)('ScraperResolver'),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperResolver);
exports.ScraperResolver = ScraperResolver;
//# sourceMappingURL=scraper.resolver.js.map