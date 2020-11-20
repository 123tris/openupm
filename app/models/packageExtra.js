/* Store extra package data to Redis.
 *
 *   pkg:$pkgname
 *     invalidTags: JSON array
 *     stars: int
 *     unity: string
 */

const redis = require("../db/redis");

const allPackagesExtraKey = "pkgs:extra";
const recentPackagesKey = "pkgs:recent";
const packageKey = "pkg:";
const propKeys = {
  imageUrl: "imageUrl",
  cachedImageFilename: "cachedImageFilename",
  cachedImageOriginalUrl: "cachedImageOriginalUrl",
  cachedImageOriginalSize: "cachedImageOriginalSize",
  cachedImageTime: "cachedImageTime",
  invalidTags: "invalidTags",
  parentStars: "pstars",
  readme: "readme",
  readmeHtml: "readmeHtml",
  scopes: "scopes",
  stars: "stars",
  unityVersion: "unity",
  updatedTime: "updatedTime",
  repoPushedTime: "repoPushedTime",
  version: "ver"
};

const setInvalidTags = async function(packageName, tags) {
  const jsonText = JSON.stringify(tags, null, 0);
  await setValue(packageName, propKeys.invalidTags, jsonText);
};

const getInvalidTags = async function(packageName) {
  const jsonText = await getValue(packageName, propKeys.invalidTags);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setScopes = async function(packageName, scopes) {
  const jsonText = JSON.stringify(scopes, null, 0);
  await setValue(packageName, propKeys.scopes, jsonText);
};

const getScopes = async function(packageName) {
  const jsonText = await getValue(packageName, propKeys.scopes);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

const setVersion = async function(packageName, version) {
  await setValue(packageName, propKeys.version, version);
};

const getVersion = async function(packageName) {
  const text = await getValue(packageName, propKeys.version);
  return text;
};

const setUnityVersion = async function(packageName, unityVersion) {
  await setValue(packageName, propKeys.unityVersion, unityVersion);
};

const getUnityVersion = async function(packageName) {
  const text = await getValue(packageName, propKeys.unityVersion);
  return text;
};

const setStars = async function(packageName, stars) {
  await setValue(packageName, propKeys.stars, stars);
};

const getStars = async function(packageName) {
  const text = await getValue(packageName, propKeys.stars);
  return parseInt(text);
};

const setParentStars = async function(packageName, stars) {
  await setValue(packageName, propKeys.parentStars, stars);
};

const getParentStars = async function(packageName) {
  const text = await getValue(packageName, propKeys.parentStars);
  return parseInt(text);
};

const setReadme = async function(packageName, readme) {
  await setValue(packageName, propKeys.readme, readme);
};

const getReadme = async function(packageName) {
  const text = await getValue(packageName, propKeys.readme);
  return text;
};

const setReadmeHtml = async function(packageName, readmeHtml) {
  await setValue(packageName, propKeys.readmeHtml, readmeHtml);
};

const getReadmeHtml = async function(packageName) {
  const text = await getValue(packageName, propKeys.readmeHtml);
  return text;
};

const setImageUrl = async function(packageName, imageUrl) {
  await setValue(packageName, propKeys.imageUrl, imageUrl);
};

const getImageUrl = async function(packageName) {
  const text = await getValue(packageName, propKeys.imageUrl);
  return text;
};

const setCachedImageUrl = async function(
  packageName,
  imageFilename,
  originalUrl,
  originalSize
) {
  await setValue(
    packageName,
    propKeys.cachedImageFilename,
    imageFilename || ""
  );
  await setValue(packageName, propKeys.cachedImageTime, new Date().getTime());
  await setValue(
    packageName,
    propKeys.cachedImageOriginalUrl,
    originalUrl || ""
  );
  await setValue(
    packageName,
    propKeys.cachedImageOriginalSize,
    originalSize || 0
  );
};

const getCachedImageFilename = async function(packageName) {
  const text = await getValue(packageName, propKeys.cachedImageFilename);
  return text;
};

const getCachedImageOriginalUrl = async function(packageName) {
  const text = await getValue(packageName, propKeys.cachedImageOriginalUrl);
  return text;
};

const getCachedImageOriginalSize = async function(packageName) {
  const text = await getValue(packageName, propKeys.cachedImageOriginalSize);
  if (!text) return 0;
  const result = parseInt(text);
  return result ? result : 0;
};

const getCachedImageTime = async function(packageName) {
  const text = await getValue(packageName, propKeys.cachedImageTime);
  if (!text) return 0;
  const result = parseInt(text);
  return result ? result : 0;
};

const setRepoPushedTime = async function(packageName, value) {
  await setValue(packageName, propKeys.repoPushedTime, value);
};

const getRepoPushedTime = async function(packageName) {
  const value = await getValue(packageName, propKeys.repoPushedTime);
  return parseInt(value);
};

const setUpdatedTime = async function(packageName, updatedTime) {
  await setValue(packageName, propKeys.updatedTime, updatedTime);
};

const getUpdatedTime = async function(packageName) {
  const value = await getValue(packageName, propKeys.updatedTime);
  return parseInt(value);
};

const setValue = async function(packageName, propKey, propVal) {
  const key = packageKey + packageName;
  await redis.client.hset(key, propKey, propVal);
};

const getValue = async function(packageName, propKey) {
  const key = packageKey + packageName;
  return await redis.client.hget(key, propKey);
};

/**
 * Set aggregated extra data.
 * @param {object} obj
 */
const setAggregatedExtraData = async function(obj) {
  const jsonText = JSON.stringify(obj, null, 0);
  await redis.client.set(allPackagesExtraKey, jsonText);
};

/**
 * Get aggregated extra data.
 */
const getAggregatedExtraData = async function() {
  const jsonText = await redis.client.get(allPackagesExtraKey);
  return jsonText === null ? {} : JSON.parse(jsonText);
};

/**
 * Set recent packages.
 * @param {object} obj
 */
const setRecentPackages = async function(arr) {
  const jsonText = JSON.stringify(arr, null, 0);
  await redis.client.set(recentPackagesKey, jsonText);
};

/**
 * Get recent packages.
 */
const getRecentPackages = async function() {
  const jsonText = await redis.client.get(recentPackagesKey);
  return jsonText === null ? [] : JSON.parse(jsonText);
};

module.exports = {
  getAggregatedExtraData,
  getCachedImageOriginalUrl,
  getCachedImageOriginalSize,
  getCachedImageTime,
  getCachedImageFilename,
  getImageUrl,
  getInvalidTags,
  getParentStars,
  getReadme,
  getReadmeHtml,
  getRecentPackages,
  getRepoPushedTime,
  getScopes,
  getStars,
  getUnityVersion,
  getUpdatedTime,
  getVersion,
  setAggregatedExtraData,
  setCachedImageUrl,
  setImageUrl,
  setInvalidTags,
  setParentStars,
  setReadme,
  setReadmeHtml,
  setRecentPackages,
  setRepoPushedTime,
  setScopes,
  setStars,
  setUnityVersion,
  setUpdatedTime,
  setVersion
};
