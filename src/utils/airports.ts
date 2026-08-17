import type { Airport } from '../types/airport';
import guangsu from '../data/airports/guangsu.json';
import xingdaomeng from '../data/airports/xingdaomeng.json';
import lingmao from '../data/airports/lingmao.json';
import feimao from '../data/airports/feimao.json';
import weitu from '../data/airports/weitu.json';
import yuzhou from '../data/airports/yuzhou.json';
import u1s1 from '../data/airports/u1s1.json';
import jilian from '../data/airports/jilian.json';
import guangnianti from '../data/airports/guangnianti.json';
import yifan from '../data/airports/yifan.json';
import ermao from '../data/airports/ermao.json';
import sogo from '../data/airports/sogo.json';
import kexin from '../data/airports/kexin.json';
import sujie from '../data/airports/sujie.json';
import kuaili from '../data/airports/kuaili.json';
import quanqiu from '../data/airports/quanqiu.json';

export const allAirports: Airport[] = [
  guangsu as Airport,
  xingdaomeng as Airport,
  lingmao as Airport,
  feimao as Airport,
  weitu as Airport,
  yuzhou as Airport,
  u1s1 as Airport,
  jilian as Airport,
  guangnianti as Airport,
  yifan as Airport,
  ermao as Airport,
  sogo as Airport,
  kexin as Airport,
  sujie as Airport,
  kuaili as Airport,
  quanqiu as Airport,
];

export function getAllAirports(): Airport[] {
  return allAirports;
}

export function getFeaturedAirports(): Airport[] {
  // Top 4 representative brands
  return [guangsu as Airport, xingdaomeng as Airport, lingmao as Airport, feimao as Airport];
}

export function getAirportBySlug(slug: string): Airport | undefined {
  return allAirports.find((a) => a.slug === slug);
}
