# primitives

## bigInt​

Signed `bigint` values.

Generate any bigint value taken into the specified range. Both lower bound and upper bound are included into the range of possible values.

**Signatures:**

- `fc.bigInt()`
- `fc.bigInt({min?, max?})`
- `fc.bigInt(min, max)`

**with:**

- `min?` --- *lower bound of the range (included)*
- `max?` --- *upper bound of the range (included)*

**Usages:**

```
fc.bigInt();
// Examples of generated values:
// - 40519302182168582469083131396737815984915854610111397506754347703341259198524n
// - 23951610212595764539175455250207245555782767082407094676187361741043426472154n
// - 30295980883260580261886608760731577493472838495202972700546280276253358609031n
// - -11868238563800054718695098172873792117821728883208728506070757173361404354997n
// - 35n
// - ...
fc.bigInt({min:0n,max:12345678901234567890n});
// Note: All possible bigint values between `0n` (included) and `12345678901234567890n` (included)
// Examples of generated values: 10743587536809719502n, 12345678901234567887n, 1n, 18n, 3991213889543870829n...
fc.bigInt({min:-3000n,max:100n});
// Note: All possible bigint values between `-3000n` (included) and `100n` (included)
// Examples of generated values: 1n, -2n, -1064n, 0n, -147n...
fc.bigInt({min:1n<<64n});
// Note: Any possible bigint value greater or equal to `1n << 64n`
// Examples of generated values:
// - 18446744073709551637n
// - 46981635298839638819090544091451527470150794541406966757340574520618867005787n
// - 18446744073709551630n
// - 56018523185942628466562775307785743268387645013311767424219309719910490250614n
// - 18446744073709551631n
// - ...
```

## boolean​

Boolean values, either `true` or `false`

**Signatures:**

- `fc.boolean()`

## date​

---

Date values.

Generate any possible dates in the specified range. Both the lower bound and upper bound of the range are included in the set of possible values.

**Signatures:**

- `fc.date()`
- `fc.date({ min?, max?, noInvalidDate? })`

**with:**

- `min?` --- default: `new Date(-8640000000000000)` --- *lower bound of the range (included)*
- `max?` --- default: `new Date(8640000000000000)` --- *upper bound of the range (included)*
- `noInvalidDate?` --- default: `false` --- *when `true` the Date "Invalid Date" will never be defined*

**Usages:**

```
fc.date();
// Examples of generated values:
// - new Date("-102261-04-16T03:19:33.548Z")
// - new Date("1970-01-01T00:00:00.004Z")
// - new Date("+111995-07-24T19:09:16.732Z")
// - new Date("-058362-10-19T15:40:37.384Z")
// - new Date("+208885-10-19T22:12:53.768Z")
// - ...
fc.date({min:newDate('2000-01-01T00:00:00.000Z')});
// Examples of generated values:
// - new Date("+199816-07-04T12:57:41.796Z")
// - new Date("2000-01-01T00:00:00.039Z")
// - new Date("2000-01-01T00:00:00.047Z")
// - new Date("2000-01-01T00:00:00.003Z")
// - new Date("+275760-09-12T23:59:59.982Z")
// - ...
fc.date({max:newDate('2000-01-01T00:00:00.000Z')});
// Examples of generated values:
// - new Date("-201489-02-25T08:12:55.332Z")
// - new Date("1969-12-31T23:59:59.994Z")
// - new Date("1970-01-01T00:00:00.006Z")
// - new Date("1970-01-01T00:00:00.019Z")
// - new Date("-271821-04-20T00:00:00.033Z")
// - ...
fc.date({min:newDate('2000-01-01T00:00:00.000Z'),max:newDate('2000-12-31T23:59:59.999Z')});
// Examples of generated values:
// - new Date("2000-05-15T03:02:40.263Z")
// - new Date("2000-10-22T03:00:45.936Z")
// - new Date("2000-02-25T19:00:10.679Z")
// - new Date("2000-12-31T23:59:59.997Z")
// - new Date("2000-01-04T14:12:03.484Z")
// - ...
fc.date({noInvalidDate:true});
// Examples of generated values:
// - new Date("-043663-07-08T11:17:34.486Z")
// - new Date("-169183-12-11T00:28:46.358Z")
// - new Date("1969-12-31T23:59:59.988Z")
// - new Date("1969-12-31T23:59:59.984Z")
// - new Date("-271821-04-20T00:00:00.033Z")
// - ...
```

## integer​

---

Signed integer values.

Generate any possible integer in the specified range. Both the lower bound and upper bound of the range are included in the set of possible values.

**Signatures:**

- `fc.integer()`
- `fc.integer({min?, max?})`

**with:**

- `min?` --- default: `-2147483648` --- *lower bound of the range (included)*
- `max?` --- default: `2147483647` --- *upper bound of the range (included)*

**Usages:**

```
fc.integer();
// Note: All possible integers between `-2147483648` (included) and `2147483647` (included)
// Examples of generated values: -1064811759, -2147483638, 2032841726, 930965475, -1...
fc.integer({min:-99,max:99});
// Note: All possible integers between `-99` (included) and `99` (included)
// Examples of generated values: 33, -94, 5, -2, 97...
fc.integer({min:65536});
// Note: All possible integers between `65536` (included) and `2147483647` (included)
// Examples of generated values: 487771549, 1460850457, 1601368274, 1623935346, 65541...

```

## nat​

---

Positive integer values (including zero).

Generate any possible positive integer between zero and the upper bound. Both zero and the upper bound are included in the set of possible values.

**Signatures:**

- `fc.nat()`
- `fc.nat({max?})`
- `fc.nat(max)`

**with:**

- `max?` --- default: `2147483647` --- *upper bound of the range (included)*

**Usages:**

```
fc.nat();
// Note: All possible integers between `0` (included) and `2147483647` (included)
// Examples of generated values: 2, 5, 2147483618, 225111650, 1108701149...
fc.nat(1000);
// Note: All possible integers between `0` (included) and `1000` (included)
// Examples of generated values: 2, 8, 4, 270, 0...
fc.nat({max:1000});
// Note: All possible integers between `0` (included) and `1000` (included)
// Examples of generated values: 917, 60, 599, 696, 7...

```

## maxSafeInteger​

---

All the range of signed integer values.

Generate any possible integer ie. from `Number.MIN_SAFE_INTEGER` (included) to `Number.MAX_SAFE_INTEGER` (included).

**Signatures:**

- `fc.maxSafeInteger()`

**Usages:**

```
fc.maxSafeInteger();
// Examples of generated values: 4, -6906426479593829, -9007199254740981, 1468597314308129, -31...

```

Available since 1.11.0.

## maxSafeNat​

---

All the range of positive integer values (including zero).

Generate any possible positive integer ie. from `0` (included) to `Number.MAX_SAFE_INTEGER` (included).

**Signatures:**

- `fc.maxSafeNat()`

**Usages:**

```
fc.maxSafeNat();
// Examples of generated values: 8974418498592146, 7152466311278303, 7682568104547082, 5480146126393191, 6062166945524051...

```

Available since 1.11.0.

## float​

---

Floating point values with 32-bit precision.

Generate any floating point value taken into the specified range. The lower and upper bounds are included into the range of possible values.

It always generates valid 32-bit floating point values.

**Signatures:**

- `fc.float()`
- `fc.float({min?, max?, minExcluded?, maxExcluded?, noDefaultInfinity?, noNaN?, noInteger?})`

**with:**

- `min?` --- default: `-∞` and `-3.4028234663852886e+38` when `noDefaultInfinity:true` --- *lower bound for the generated 32-bit floats (included)*
- `max?` --- default: `+∞` and `+3.4028234663852886e+38` when `noDefaultInfinity:true` --- *upper bound for the generated 32-bit floats (included)*
- `minExcluded?` --- default: `false` --- *do not include `min` in the set of possible values*
- `maxExcluded?` --- default: `false` --- *do not include `max` in the set of possible values*
- `noDefaultInfinity?` --- default: `false` --- *use finite values for `min` and `max` by default*
- `noNaN?` --- default: `false` --- *do not generate `Number.NaN`*
- `noInteger?` --- default: `false` --- *do not generate values matching `Number.isInteger`*

**Usages:**

```
fc.float();
// Note: All possible 32-bit floating point values (including -∞, +∞ and NaN but also -0)
// Examples of generated values: -1.1428610944376996e+35, -4.923316419364955e-39, 7.923675937604457e-9, 1.0574891476389556e+24, -0.012089259922504425...
fc.float({min:0});
// Note: All possible positive 32-bit floating point values (including +∞ and NaN)
// Examples of generated values: 722749030400, 9.80908925027372e-45, 4.549913925362434e+24, 4.32932694138799e-7, 3.4028224522648084e+38...
fc.float({noDefaultInfinity:true,noNaN:true});
// Note: All possible finite 32-bit floating point values
// Examples of generated values: 0.0030062051955610514, 5.605193857299268e-45, 3.4028212353202322e+38, -2.802596928649634e-45, -160112.453125...
fc.float({noDefaultInfinity:true,min:Number.NEGATIVE_INTEGER,max:Number.POSITIVE_INTEGER});
// Note: Same as fc.float(), noDefaultInfinity just tells that defaults for min and max
// should not be set to -∞ and +∞. It does not forbid the user to explicitely set them to -∞ and +∞.
// Examples of generated values: -5.435122013092041, 1981086548623360, -2.2481372319305137e-9, -2.5223372357846707e-44, 5.606418179297701e-30...
fc.float({min:0,max:1,maxExcluded:true});
// Note: All possible 32-bit floating point values between 0 (included) and 1 (excluded)
// Examples of generated values: 3.2229864679470793e-44, 2.4012229232976108e-20, 1.1826533935374394e-27, 0.9999997615814209, 3.783505853677006e-44...
fc.float({noInteger:true});
// Note: All possible 32-bit floating point values but no integer
// Examples of generated values: -7.006492321624085e-45, 1.4734616113175924e-21, 8.407790785948902e-45, 1.5815058151957828e-9, Number.POSITIVE_INFINITY...
fc.noBias(fc.integer({min:0,max:(1<<24)-1}).map((v)=> v /(1<<24)));
// Note: `fc.float` does not uniformly distribute the generated values in the requested range.
// If you really want a uniform distribution of 32-bit floating point numbers in range 0 (included)
// and 1 (excluded), you may want to use the arbitrary defined right above.
// Examples of generated values: 0.06896239519119263, 0.5898661017417908, 0.7715556621551514, 0.4010099768638611, 0.8638045787811279...

```

Available since 0.0.6.

## double​

---

Floating point values.

Generate any floating point value taken into the specified range. The lower and upper bounds are included into the range of possible values.

**Signatures:**

- `fc.double()`
- `fc.double({min?, max?, minExcluded?, maxExcluded?, noDefaultInfinity?, noNaN?, noInteger?})`

**with:**

- `min?` --- default: `-∞` and `-Number.MAX_VALUE` when `noDefaultInfinity:true` --- *lower bound for the generated 32-bit floats (included)*
- `max?` --- default: `+∞` and `Number.MAX_VALUE` when `noDefaultInfinity:true` --- *upper bound for the generated 32-bit floats (included)*
- `minExcluded?` --- default: `false` --- *do not include `min` in the set of possible values*
- `maxExcluded?` --- default: `false` --- *do not include `max` in the set of possible values*
- `noDefaultInfinity?` --- default: `false` --- *use finite values for `min` and `max` by default*
- `noNaN?` --- default: `false` --- *do not generate `Number.NaN`*
- `noInteger?` --- default: `false` --- *do not generate values matching `Number.isInteger`*

**Usages:**

```
fc.double();
// Note: All possible floating point values (including -∞, +∞ and NaN but also -0)
// Examples of generated values: 6.978211330273434e+123, 2.6272140589206812e-53, 947075901019127, -1.3737004055555409e-182, -4.4e-323...
fc.double({min:0});
// Note: All possible positive floating point values (including +∞ and NaN)
// Examples of generated values: 8.762813623312512e-262, 5.0929130565593696e-226, 1.3411163978818024e+222, 8845029414547763, 8.4e-323...
fc.double({noDefaultInfinity:true,noNaN:true});
// Note: All possible finite floating point values
// Examples of generated values: -3.0862366688503372e+144, -1.7384136409372626e-212, 1.7976931348623153e+308, 2.5e-323, -1.1800479468035008e+224...
fc.double({noDefaultInfinity:true,min:Number.NEGATIVE_INTEGER,max:Number.POSITIVE_INTEGER});
// Note: Same as fc.double(), noDefaultInfinity just tells that defaults for min and max
// should not be set to -∞ and +∞. It does not forbid the user to explicitely set them to -∞ and +∞.
// Examples of generated values: 7.593633990222606e-236, -5.74664305820822e+216, -1.243100551492039e-161, 1.7976931348623143e+308, -1.7976931348623157e+308...
fc.double({min:0,max:1,maxExcluded:true});
// Note: All possible floating point values between 0 (included) and 1 (excluded)
// Examples of generated values: 4.801635255684817e-73, 4.882602580683884e-55, 0.9999999999999998, 0.9999999999999991, 2.5e-323...
fc.double({noInteger:true});
// Note: All possible floating point values but no integer
// Examples of generated values: 9.4e-323, 4503599627370491.5, -1.8524776326185756e-119, 2.5e-323, -5e-323...
fc.noBias(
  fc
.tuple(fc.integer({min:0,max:(1<<26)-1}), fc.integer({min:0,max:(1<<27)-1}))
.map((v)=>(v[0]*Math.pow(2,27)+ v[1])*Math.pow(2,-53)),
);
// Note: `fc.double` does not uniformly distribute the generated values in the requested range.
// If you really want a uniform distribution of 64-bit floating point numbers in range 0 (included)
// and 1 (excluded), you may want to use the arbitrary defined right above.
// Examples of generated values: 0.5424979085274226, 0.8984809917404123, 0.577376440989232, 0.8433714130130558, 0.48219857913738606...

```

tip: If you want to join several strings together: refer to our combiners section. We have some built-in combiners working exclusively on string values.

## string​

---

String containing characters produced by the character generator defined for `unit`. By default, `unit` defaults to `'grapheme-ascii'`. Our `unit`s have been built from documents linked to the specifications of Unicode 15.

**Signatures:**

- `fc.string()`
- `fc.string({minLength?, maxLength?, size?, unit?})`

**with:**

- `unit?` --- default: `'grapheme-ascii'` --- *how to generate the characters that will be joined together to create the resulting string*
- `minLength?` --- default: `0` --- *minimal number of units (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal number of units (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.string();
// Examples of generated values: "JT>\"C9k", "h]iD\"27;", "S", "n\\Ye", ""...
fc.string({maxLength:3});
// Note: Any string containing up to 3 (included) characters
// Examples of generated values: "", "ref", "?D", "key", "}"...
fc.string({minLength:3});
// Note: Any string containing at least 3 (included) characters
// Examples of generated values: "Pv-^X_t", "bind", "?DM", "iEjK.b?^O", "}~}S"...
fc.string({minLength:4,maxLength:6});
// Note: Any string containing between 4 (included) and 6 (included) characters
// Examples of generated values: "Trxlyb", "&&@%4", "s@IO", "0\"zM", "}#\"$"...
fc.string({unit:'grapheme'});
// Note: Any string made only of printable graphemes possibly made of multiple code points.
// With 'grapheme', minLength (resp. maxLength) refers to length in terms of graphemes (visual entities).
// As an example, "\u{0061}\u{0300}" has a length of 1 in this context, as it corresponds to the visual entity: "à".
// Examples of generated values: "length", "🡓𑨭", "🚌ﾱॶ🥄ၜ㏹", "key", "callஈcall"...
fc.string({unit:'grapheme-composite'});
// Note: Any string made only of printable graphemes.
// With 'grapheme-composite', minLength (resp. maxLength) refers to length in terms of code points (equivalent to visual entities for this type).
// Examples of generated values: "🭃𖼰𱍊alleef", "#", "𝕃ᖺꏪ🪓ሪ㋯𑼓𘠴𑑖", "", "\"isP"...
fc.string({unit:'grapheme-ascii'});
// Note: Any string made only of printable ascii characters.
// With 'grapheme-composite', minLength (resp. maxLength) refers to length in terms of code units aka chars (equivalent to code points and visual entities for this type).
// Examples of generated values: "+", "y\\m4", ")H", "}q% b'", "ZvT`W"...
fc.string({unit:'binary'});
// Note: Results in strings made of any possible combinations of code points no matter how they join between each others (except half surrogate pairs).
// With 'binary', minLength (resp. maxLength) refers to length in terms of code points (not in terms of visual entities).
// As an example, "\u{0061}\u{0300}" has a length of 2 in this context, even if it corresponds to a single visual entity: "à".
// Examples of generated values: "length", "𒇖ᴣ󠓋򹕎󥰆󕃝󗅛񞙢򂓥񋂐", "", "󹶇񺓯𢊊񦺖", "key"...
fc.string({unit:'binary-ascii'});
// Note: Results in strings made of any possible combinations of ascii characters (in 0000-007F range).
// With 'binary-ascii', minLength (resp. maxLength) refers to length in terms of code units aka chars (equivalent to code points for this type).
// Examples of generated values: "c\\3\f\u0000\u001f\u00047", "M\u0006\fD!U\u000fXss", "", "s\u0000", "\n\u0006tkK"...
fc.string({unit: fc.constantFrom('Hello','World')});
// Note: With a custom arbitrary passed as unit, minLength (resp. maxLength) refers to length in terms of unit values.
// As an example, "HelloWorldHello" has a length of 3 in this context.
// Examples of generated values: "", "Hello", "HelloWorld", "HelloWorldHello", "WorldWorldHelloWorldHelloWorld"...

```

# Composites

# Array

Generate array values.

## tuple​

---

Generate *tuples* \- or more precisely arrays - by aggregating the values generated by its underlying arbitraries.

**Signatures:**

- `fc.tuple(...arbitraries)`

**with:**

- `...arbitraries` --- *arbitraries that should be used to generate the values of our tuple*

**Usages:**

```
fc.tuple(fc.nat());
// Examples of generated values: [15], [1564085383], [2147483642], [1564562962], [891386821]...
fc.tuple(fc.nat(), fc.string());
// Examples of generated values: [17,"n"], [1187149108,"{}"], [302474255,"!!]"], [2147483618,"$#"], [21,"lv V!\""]...

```

## array​

---

Array of random length containing values generated by `arb`.

**Signatures:**

- `fc.array(arb)`
- `fc.array(arb, {minLength?, maxLength?, size?, depthIdentifier?})`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `depthIdentifier?` --- default: `undefined` --- *when specified, the array will impact the depth attached to the identifier to avoid going too deep if it already generated lots of items for current level*

**Usages:**

```
fc.array(fc.nat());
// Examples of generated values:
// - [1811605556]
// - [773390791,2091685325,1242440672]
// - []
// - [1782327935,900193957,2005682058,1190044745,1361174456,1816521832]
// - [2039519833,1820186979,1716322482,1252099479,313246778,1462590114,1981305846,1755169295]
// - ...
fc.array(fc.nat(),{minLength:3});
// Examples of generated values:
// - [30,1812443734,26]
// - [536894957,149319825,1808423364,1511394264]
// - [1265639866,1672446215,356045957,1686054822,2086860087]
// - [2147483618,2147483620,1209289481]
// - [946187936,1504050852,144134225,2105232789,194205091,171397027,437743867,328587192,403202026,943599425,272125438]
// - ...
fc.array(fc.nat(),{maxLength:3});
// Examples of generated values: [], [536894957], [1265639866,1672446215], [2147483618,2147483620], [1396071052,413181514,728831399]...
fc.array(fc.nat(),{minLength:5,maxLength:7});
// Examples of generated values:
// - [2013730136,353952753,1490777806,634915573,1978586276]
// - [11,2147483643,1549284389,2,2085769824,1046376312]
// - [131262217,28,2008543832,464574638,2147483621]
// - [29,1410245876,741880759,944485652,27]
// - [1558059373,1486409544,138880328,1775525007,1289633061]
// - ...
fc.array(fc.nat(),{maxLength:50,size:'max'});
// Note: By specifying size to "max", we enforce the fact that we want generated values to have between
// 0 and 50 items. In other words, we want to use the full range of specified lengths.
// Note: If not defined, by default, the size is "=" except if there is a maxLength provided and the
// global setting defaultSizeToMaxWhenMaxSpecified explicitely set to true. In such case it will
// automatically be defaulted to "max".
// Examples of generated values:
// - [2013730136,353952753,1490777806,634915573,1978586276,205766418,1175483977,32404726,52946578,1069691063,626810743,719356509,1263272304,1824194201,1899370697,1015020872,1705828766,1764355915]
// - [11,2147483643,1549284389,2,2085769824]
// - [131262217,28,2008543832,464574638]
// - [29,1410245876,741880759,944485652,27,15]
// - [1558059373,1486409544,138880328,1775525007,1289633061,2110277820,2132428886,243113350,370748226,1289875763,1926931276,777271555,200391383,382812004,767046802,1658449850,471365442,258979782,1763577358,875799138,1041944829,769854926,874760332,442170309,91717126,113325162,88812665,1097842037,804561500,1870859458,853896552,50228752,492015973]
// - ...
fc.array(fc.nat(),{maxLength:100000,size:'+1'});
// Note: From a specification point of view, the algorithm is supposed to handle up to 100,000 items.
// But, even if I want to test the algorithm on large entries I don't want to spend hours in it (it may
// not scale linearly...). By setting size to "+1" I tell fast-check that I want values larger than usual
// ones (~10x factor). If I wanted even larger ones I could have used "+2" (~100x factor), "+3" (~1000x factor)
// or "+4" (~10000x factor). On the opposite, if I wanted smaller arrays I could have used "-1" (~10x smaller)...
// Note: Size could also have been set explicitely to "=" to say: "I want the size used by default no matter the
// specified maxLength". If not defined, by default, the size is "=" except if there is a maxLength provided
// and the global setting defaultSizeToMaxWhenMaxSpecified explicitely set to true. In such case it will
// automatically be defaulted to "max".
// Examples of generated values:
// - [1499459057,110432617,339543317,591661354,869690762,903936065,24,2147483618,18,1350034659]
// - [1850529194,1877982582,756109358,26,5,10,28,933512138,3,2147483647,143549967,151486834]
// - [186214456,1304129127,236610033,1770333983,677229078,1874153157,647904631,2015875422,839334870,46102013,1303893735,1699495931,10156178,336616013,2094724689,1925510000,1437440576,355042345,2143594345,1734467233,1593448698,574044973,1111310760,76274244,1956358794,1928061897,1318184432,782455007,1247892810,249565393,857651507,1873602460,57966219,752962298,880822188,823737098,280536251,79820007,677389259,1771811403,734630420,1012881515,314976648,466444542,72628732,941152314,390898317,957018849,235229362,2043578224,1280394640,658661493,1592383816,1940643736,832534240,1299579948,954930320,205824052,1320157423,1943789311,2145245274,456558002,1177939177,472568424,90595308,390737624,1775798785,1141982866,1634207099,216091479]
// - [754990229,2147483617,2020328162,8653370]
// - [956688959,1282167266,1451864941]
// - ...
fc.letrec((tie)=>({
self: fc.record({
value: fc.nat(),
children: fc.oneof(
{depthSize:'small',depthIdentifier:'id:self'},
      fc.constant([]),
      fc.array(tie('self'),{depthIdentifier:'id:self'}),
),
}),
})).self;
// Note: We define a recursive tree structure with children defaulting to the empty array with an higher probability
// as we go deeper (thanks to `fc.oneof`) and also as we tend to generate lots of items (thanks to `depthIdentifier`
// passed to `fc.array` and being the same value as the one passed to `fc.oneof`).
// Note: For the moment, `fc.array` cannot stop the recursion alone and need to be combined with `fc.oneof` or any other
// helper being able to fallback to base cases with an higher probability as we go deeper in the recursion.
// Examples of generated values:
// - {"value":424778306,"children":[]}
// - {__proto__:null,"value":27,"children":[{__proto__:null,"value":314632820,"children":[]},{__proto__:null,"value":2142687698,"children":[]},{__proto__:null,"value":1909847367,"children":[]},{"value":1255067999,"children":[]},{__proto__:null,"value":56407905,"children":[]},{"value":1877308594,"children":[]},{"value":853104761,"children":[]},{__proto__:null,"value":365629946,"children":[]},{"value":1657598129,"children":[]},{"value":110427542,"children":[]}]}
// - {__proto__:null,"value":7,"children":[]}
// - {"value":2147483619,"children":[]}
// - {__proto__:null,"value":15,"children":[{"value":1009275606,"children":[]},{__proto__:null,"value":1086795967,"children":[{"value":1715614519,"children":[]}]}]}
// - ...

```

## uniqueArray​

---

Array of random length containing unique values generated by `arb`.

All the values in the array are unique given the provided `selector` and `comparator` functions. Two values `a` and `b` are considered equal and thus would not be selected together in the same generated array if and only if `comparator(selector(a), selector(b))` is `true`.

If not specified `selector` defaults to the identity function and `comparator` defaults to `SameValue` aka `Object.is`.

For performance reasons, we highly discourage the use of a fully custom `comparator` and recommend to rely on a custom `selector` function whenever possible. Such custom `comparator` --- outside of provided ones --- cannot be properly optimized and thus includes a potentially huge performance penalty mostly impacted large arrays.

**Signatures:**

- `fc.uniqueArray(arb)`
- `fc.uniqueArray(arb, {minLength?, maxLength?, selector?, comparator?, size?, depthIdentifier?})`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `selector?` --- default: `v => v` --- *project the generated value in order to compare it*
- `comparator?` --- default: `SameValue` --- *compare two projected values and returns `true` whenever the projected values should be considered equal. Possible values for `comparator` are:*
  - `SameValue` to rely on `Object.is` to compare items (more details)
  - `SameValueZero` to rely on the same logic as the one of `Set` or `Map` to compare items (more details)
  - `IsStrictlyEqual` to rely on `===` to compare items (more details)
  - Fully custom function having the signature: `(selectedValueA, seletedValueB) => aIsEqualToB`
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `depthIdentifier?` --- default: `undefined` --- *when specified, the array will impact the depth attached to the identifier to avoid going too deep if it already generated lots of items for current level*

**Usages:**

```
fc.uniqueArray(fc.nat(99));
// Examples of generated values: [51,68,39,84,4,40,60], [51,61,41,48,77,59,89,22,83,29], [], [69,52,75,15,34,91,10,87,26,85], [31,4,35,59,9,79,70,94,67]...
fc.uniqueArray(
  fc.record({
id: fc.nat(),
name: fc.constantFrom('Anna','Paul'),
}),
{selector:(entry)=> entry.id},
);
// Note: Resulting arrays will never contain two entries having the same id
// Examples of generated values:
// - [{"id":8,"name":"Paul"},{__proto__:null,"id":1716584425,"name":"Anna"},{"id":16,"name":"Paul"}]
// - [{__proto__:null,"id":2049051311,"name":"Anna"},{__proto__:null,"id":1283697894,"name":"Anna"},{__proto__:null,"id":1860796933,"name":"Anna"},{__proto__:null,"id":920772045,"name":"Paul"},{__proto__:null,"id":1057553570,"name":"Paul"},{"id":101460318,"name":"Anna"},{__proto__:null,"id":1879148481,"name":"Anna"},{"id":1138488825,"name":"Anna"}]
// - [{"id":369913425,"name":"Paul"},{__proto__:null,"id":397480404,"name":"Paul"}]
// - [{"id":2147483638,"name":"Paul"},{__proto__:null,"id":23,"name":"Paul"},{"id":1559153908,"name":"Anna"},{"id":1,"name":"Paul"},{"id":961925886,"name":"Anna"},{__proto__:null,"id":13,"name":"Paul"}]
// - [{__proto__:null,"id":511407241,"name":"Paul"},{"id":192887817,"name":"Paul"},{"id":777663452,"name":"Paul"},{"id":83639041,"name":"Paul"},{__proto__:null,"id":1769176807,"name":"Anna"},{"id":1954098657,"name":"Anna"},{__proto__:null,"id":895746379,"name":"Anna"},{"id":1674827795,"name":"Anna"},{__proto__:null,"id":462597371,"name":"Anna"}]
// - ...
fc.uniqueArray(fc.constantFrom(-1,-0,0,1,Number.NaN));
// Note: By default `uniqueArray` is using `SameValue` algorithm
// so 0 is different from -0 and NaN equals NaN...
// Examples of generated values: [1,-0,Number.NaN], [1,-0], [0,1,-0,-1,Number.NaN], [Number.NaN,1,-1], [-1,-0,1,Number.NaN,0]...
fc.uniqueArray(fc.constantFrom(-1,-0,0,1,Number.NaN),{comparator:'SameValueZero'});
// Note: ...but it could be overriden by `SameValueZero`
// so 0 equals -0 and NaN is equals NaN...
// Examples of generated values: [-0,Number.NaN,1], [Number.NaN,-0,1,-1], [], [0,Number.NaN,-1], [0,-1,1,Number.NaN]...
fc.uniqueArray(fc.constantFrom(-1,-0,0,1,Number.NaN),{comparator:'IsStrictlyEqual'});
// Note: ...or it could be overriden by `IsStrictlyEqual`
// so 0 equals -0 and NaN is different from NaN...
// Examples of generated values: [], [Number.NaN], [0,1], [0,-1,Number.NaN], [-1,0,1]...
fc.uniqueArray(fc.constantFrom(-1,-0,0,1,Number.NaN),{comparator:(a, b)=>Math.abs(a)===Math.abs(b)});
// Note: ...or overriden by a fully custom comparator function
// With the function defined in this example we will never have 1 and -1 toegther, or 0 and -0 together
// but we will be able to have many times NaN as NaN !== NaN.
// Examples of generated values:
// - [-0,-1,Number.NaN,Number.NaN,Number.NaN,Number.NaN,Number.NaN,Number.NaN]
// - [Number.NaN,-0,-1,Number.NaN,Number.NaN,Number.NaN,Number.NaN,Number.NaN,Number.NaN]
// - [Number.NaN,-0,1,Number.NaN]
// - [-1,-0]
// - [Number.NaN,0,1]
// - ...

```

Available since 2.23.0.

## sparseArray​

---

Sparse array of random length containing values generated by `arb`.

By default, the generated array may end by a hole (see `noTrailingHole`).

**Signatures:**

- `fc.sparseArray(arb)`
- `fc.sparseArray(arb, {maxLength?, minNumElements?, maxNumElements?, size?, noTrailingHole?, depthIdentifier?})`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*
- `minNumElements?` --- default: `0` --- *minimal number of elements (included)*
- `maxNumElements?` --- default: `0x7fffffff` more --- *maximal number of elements (included) - when not specified, the algorithm generating random values will consider it equal to `maxGeneratedLengthFromSizeForArbitrary(minNumElements, size)` but the shrinking one will use `0x7fffffff`*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included) - length includes elements but also holes for sparse arrays - when not specified, the algorithm generating random values will consider it equal to `maxGeneratedLengthFromSizeForArbitrary(maxNumElements used by generate, size)` but the shrinking one will use `0x7fffffff`*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `noTrailingHole?` --- default: `false` --- *when enabled, all generated arrays will either be the empty array or end by a non-hole*
- `depthIdentifier?` --- default: `undefined` --- *when specified, the array will impact the depth attached to the identifier to avoid going too deep if it already generated lots of items for current level*

**Usages:**

```
fc.sparseArray(fc.nat(),{maxLength:20});
// Examples of generated values:
// - [1627484989,,,,,,,,,22,,,,,,,,,11]
// - [,,,,,,,,,,,,,,,,,]
// - [1043017167,930550953,,,,498049739,,,,,,,,235141741,,738215975,680577423,,,2064971973]
// - [,,,,,,]
// - [62419385,,1707521378,1036722778,,,,356343941,,,1112723591]
// - ...
fc.sparseArray(fc.nat(),{maxLength:20,minNumElements:1,maxNumElements:3});
// Examples of generated values:
// - [,,,,,,2004160460,,5,,,,,,,]
// - [,,,,,,,,,,,,,10,1247873180,24]
// - [,,,,,,,,,,630417302,,]
// - [,,634971820,827905281,,,,,]
// - [2147483627,,,,,,,24,,,,,,1018653780]
// - ...
fc.sparseArray(fc.nat(),{maxLength:20,noTrailingHole:true});
// Examples of generated values:
// - [,,,,,,,,,,,,,,184571604,,1332679116]
// - [701596391,,13,477087993,,,,,,9,,,,,1837515799,,25,,1052666808]
// - [377875514,,,,,,,,,,382054662,152349138,,410337560,,,,,522248788]
// - [,,,1403559564,,,,,,,,,,,,793214440]
// - [2147483631,,,2147483639]
// - ...
fc.sparseArray(fc.nat());
// Examples of generated values:
// - [567750362,,,,,299091021,,,96489016,,430712239,1234134991,,,,1397461705,,,730578007,,357868161]
// - [,,2134637909,,,,,,,,,,,,,,,974140509]
// - [,,,787200555,482854155,,1499996148,,641656016,,,,1222781086,594176416,,,,,,,1481640999,,541444578,,,,1102940112,,,1044037657]
// - [,,1813325449,142891531,1033921636,,,,,,,,,,,,,,,16063768,,,,,,]
// - [,,,,1986457412,,,,1986792467,346901065,,,,1043089270,,,,1052063773,,,,117173340,,1802061561,,,1876841731,2059591309]
// - ...
fc.sparseArray(fc.nat(),{size:'+1'});
// Note: By specifying a size higher than the currently configured one, we ask for larger arrays in terms of number of
// elements (see minNumElements and maxNumElements) but also in terms of length (see maxLength).
// Examples of generated values:
// - Object.assign(Array(1200),{498:4,1199:465389025})
// - Object.assign(Array(1154),{10:1275475127,68:1282936956,88:7087106,103:274973107,228:214695477,265:861580584,295:771934152,353:2092009603,399:2045432038,413:2047925581,414:1057390520,471:60415562,520:440518484,535:308102024,606:1012962996,609:1034110033,661:1605711835,758:1994416982,780:1836707994,799:837969364,805:48536112,920:31493298,1118:477398469,1153:1382960253})
// - Object.assign(Array(1198),{14:1265106397,25:1992189706,31:1009542633,37:2103360753,39:2105840658,41:27425052,45:947954479,71:1108948663,86:1920541257,87:1399025075,93:1255551598,97:244052130,105:1557208578,129:1710577472,141:391872683,162:16081929,175:39586497,186:654374742,190:1687117881,287:474014452,342:1105765185,360:1493656073,375:236096982,420:1206486228,436:1628321689,437:749903635,445:1548247725,486:190055012,489:1712264957,536:1601477084,545:1391277520,607:366935947,615:1706042271,650:1371529122,661:436134238,685:579512012,709:1719244372,713:1697974975,734:330762410,740:1565436488,751:653241245,754:294417483,770:1406773247,779:1207966138,831:334418096,880:2109546690,896:4454713,946:1749660318,962:379501736,998:879759299,1031:1199146443,1037:1167013446,1038:108442984,1058:374755399,1061:1537141349,1068:1521525089,1078:1342256788,1080:332676776,1135:2022624121,1155:1828572490,1165:1317565260,1177:2060796612})
// - [,,,,,,,,,]
// - Object.assign(Array(1199),{0:490598143,1:15,2:15,3:1073857704,5:14,7:1574740959,8:447582064,10:2147483625,21:501462968,170:800696723,191:2147483625,208:1027453018,232:368221366,318:553146768,353:691955534,399:1626051171,421:29,443:27,477:5,480:7,581:10,639:1950373478,641:3,656:277325962,690:420312969,710:1113621528,882:2147483625,893:1920703967,947:19,974:9,1000:12,1041:777636885,1086:1283251245,1111:2147483622,1112:2003627018,1185:672201936,1190:2147483638,1191:236447272,1192:1051806815,1193:244597135,1194:2104695915,1195:768174940,1196:3,1198:29})
// - ...
```

# Function

Generate functions.

## compareBooleanFunc​

---

Generate a comparison function taking two parameters `a` and `b` and producing a boolean value.

`true` means that `a < b`, `false` that `a = b` or `a > b`

**Signatures:**

- `fc.compareBooleanFunc()`

**Usages:**

```
fc.compareBooleanFunc();
// Examples of generated values:
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-29' + stringify(a)) % 17;
//     const hB = hash('-29' + stringify(b)) % 17;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('524475365' + stringify(a)) % 3037322393;
//     const hB = hash('524475365' + stringify(b)) % 3037322393;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-29' + stringify(a)) % 2516443298;
//     const hB = hash('-29' + stringify(b)) % 2516443298;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('2126217969' + stringify(a)) % 3737752172;
//     const hB = hash('2126217969' + stringify(b)) % 3737752172;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA < hB;
//     const hA = hash('-480068351' + stringify(a)) % 3671794935;
//     const hB = hash('-480068351' + stringify(b)) % 3671794935;
//     return cmp(hA, hB);
//   }
// - ...

```

Available since 1.6.0.

## compareFunc​

---

Generate a comparison function taking two parameters `a` and `b` and producing an integer value.

Output is zero when `a` and `b` are considered to be equivalent. Output is strictly inferior to zero means that `a` should be considered strictly inferior to `b` (similar for strictly superior to zero)

**Signatures:**

- `fc.compareFunc()`

**Usages:**

```
fc.compareFunc();
// Examples of generated values:
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-1057705109' + stringify(a)) % 2425734305;
//     const hB = hash('-1057705109' + stringify(b)) % 2425734305;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-13' + stringify(a)) % 20;
//     const hB = hash('-13' + stringify(b)) % 20;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('2004846960' + stringify(a)) % 2464093828;
//     const hB = hash('2004846960' + stringify(b)) % 2464093828;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('1384924905' + stringify(a)) % 2242944706;
//     const hB = hash('1384924905' + stringify(b)) % 2242944706;
//     return cmp(hA, hB);
//   }
// - function(a, b) {
//     // With hash and stringify coming from fast-check
//     const cmp = (hA, hB) => hA - hB;
//     const hA = hash('-741474720' + stringify(a)) % 555135046;
//     const hB = hash('-741474720' + stringify(b)) % 555135046;
//     return cmp(hA, hB);
//   }
// - ...

```

Available since 1.6.0.

## func​

---

Generate a function producing values using an underlying arbitrary.

**Signatures:**

- `fc.func(arb)`

**with:**

- `arb` --- *arbitrary responsible to produce the values*

**Usages:**

```
fc.func(fc.nat());
// Examples of generated values:
// - function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [18];
//     return outs[hash('-2147483647' + stringify(args)) % outs.length];
//   }
// - function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [1044253015,881466391,1911917064,3,2147483643,11,1097098198];
//     return outs[hash('-2147483643' + stringify(args)) % outs.length];
//   }
// - function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [1644861079,2004697269];
//     return outs[hash('-31' + stringify(args)) % outs.length];
//   }
// - function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [1192604909,672581076,1502245668,31791972,1761768821,396996837,676877520,1919262427,641285424];
//     return outs[hash('-493007294' + stringify(args)) % outs.length];
//   }
// - function(...args) {
//     // With hash and stringify coming from fast-check
//     const outs = [624842423,32338439,1321248893,980127887,850807339,1583851385,1093421004,1758229721,464930963];
//     return outs[hash('-2147483642' + stringify(args)) % outs.length];
//   }
// - ...
```

# Iterable

Generate iterable values.

## infiniteStream​

---

Generate infinite `Stream` of values generated by `arb`.

The `Stream` structure provided by fast-check implements `IterableIterator<T>` and comes with useful helpers to manipulate it.

**Signatures:**

- `fc.infiniteStream(arb)`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*

**Usages:**

```
fc.infiniteStream(fc.nat(9));
// Examples of generated values: Stream(...)...
```

# Object

Generate object values.

## dictionary​

---

Generate dictionaries containing keys generated using `keyArb` and values generated by `valueArb`.

**Signatures:**

- `fc.dictionary(keyArb, valueArb)`
- `fc.dictionary(keyArb, valueArb, {minKeys?, maxKeys?, size?, noNullPrototype?, depthIdentifier?})`

**with:**

- `keyArb` --- *arbitrary instance responsible to generate keys*
- `valueArb` --- *arbitrary instance responsible to generate values*
- `minKeys?` --- default: `0` --- *minimal number of keys in the generated instances (included)*
- `maxKeys?` --- default: `0x7fffffff` more --- *maximal number of keys in the generated instances (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `noNullPrototype?` --- default: `false` --- *only generate objects based on the Object-prototype, do not generate any object with null-prototype*
- `depthIdentifier?` --- default: `undefined` --- *share the depth between instances using the same `depthIdentifier`*

**Usages:**

```
fc.dictionary(fc.string(), fc.string());
// Examples of generated values:
// - {__proto__:null,"<H":"`D? &7A","T>X0Aa]tp>":":5+|","8{0.mI>8R,":"j._[Xi&.[","!83F]'E1_":"y[bB,G$_S}","NnY,!{":"6NZ4,G'}","Y&>Uj":"gg@eTi","e>QDNvD/gz":"Bt0&oV;","ULLW1":"F6i_","?&I":"lPd7}"}
// - {__proto__:null,"_":" y|","Yo+\"O@q+j":"cI{H","":"3#$}9{5!z","?^~k ":"w$defipro","[fa4c":"J"}
// - {__proto__:null,"~":""}
// - {"lzproperty":"?"}
// - {"hOIY\"R q}":"W","l__defineG":"8x`:H0?T"}
// - ...
fc.dictionary(fc.string(), fc.nat());
// Examples of generated values:
// - {__proto__:null,"":11,".[hM+$+:?N":30,"%{":59342696,"|_":29,"E":670852246,"pl_":2147483639,">":2147483630,"M7cU?#9":1072636200,"ot":1627183273}
// - {"_G@>x":461241683,"@9c=&6H:c0":105089967,"c_)r66nwK":1355210745}
// - {__proto__:null,"#1O;mZ1":1005073225}
// - {}
// - {"6":144134225,".9":437743867,"tR?j$Hat3X":1920000943,"DQTd":324814916}
// - ...
fc.dictionary(fc.string(), fc.nat(),{minKeys:2});
// Note: Generate instances with at least 2 keys
// Examples of generated values:
// - {"%{":11,"4cH":12,"ke":2147483622,"rqM~i'":485910780}
// - {__proto__:null,"K":1498847755,"&cP<5:e(y\"":1430281549,"!\"2a":1631161561,"dY+g":1880545446,"M2+^,Yq7~t":1437539188}
// - {__proto__:null,"NfXclS":815533370,"?":2060844890,"":1862140278,"R":618808229,"N|":25902062,"DGw00u?brK":348863633}
// - {" R~Own":2147483645,"~":16,"i$#D":1037390287}
// - {__proto__:null,">YTN<Tt":1950414260,"I6":1505301756,"2;]'dH.i!":815067799,":kmC'":1948205418,"g|GTLPe-":2101264769}
// - ...
fc.dictionary(fc.string(), fc.string(),{noNullPrototype:true});
// Note: Do not generate any object with null prototype, always define them with Object prototype
// Examples of generated values:
// - {"~}P-T{^H`":"X~bd\"T","3Y,I8B\\*":"i;vLI(7R|","_":"o>|L~","RIUht":"x>?!**l:\\o","8oV?LkD@LD":"E%leQ*Q}4O"}
// - {}
// - {"zQD\"x!p":"V<GfsgU","q1RH0sG":"rXM>>","Eo3iTH4f":"","sU3":"FJ-"}
// - {"iY7s.{?":"&i>","V`x?~qpp4C":"3+u$","I!z{na":",0D^g/G5"}
// - {"Vo=AG":"0D%{Mv2c>w","_~dC3=@D":"f-","=":"vluzcJ"}
// - ...

```

Available since 1.0.0.

## record​

---

Generate records using the incoming arbitraries to generate its values.

It comes very useful when dealing with settings.

**Signatures:**

- `fc.record(recordModel)`
- `fc.record(recordModel, {requiredKeys?, noNullPrototype?})`

**with:**

- `recordModel` --- *structure of the resulting instance*
- `requiredKeys?` --- default: `[all keys of recordModel]` --- *list of keys that should never be deleted*
- `noNullPrototype?` --- default: `false` --- *only generate records based on the Object-prototype, do not generate any record with null-prototype*

**Usages:**

```
fc.record({
id: fc.uuid({version:4}),
age: fc.nat(99),
});
// Examples of generated values:
// - {__proto__:null,"id":"0000001f-2a24-4215-b068-5798948c5f90","age":3}
// - {__proto__:null,"id":"acf6f6c5-fff4-4fff-bfff-fff0a2ca880f","age":18}
// - {__proto__:null,"id":"5682d7df-8023-4f9b-b7a7-19500000001a","age":5}
// - {"id":"0000000b-001a-4000-8000-0001c7ed6eaf","age":93}
// - {"id":"f4f0e509-dcc3-435a-8000-0007fffffffe","age":7}
// - ...
fc.record(
{
id: fc.uuid({version:4}),
age: fc.nat(99),
},
{requiredKeys:[]},
);
// Note: Both id and age will be optional values
// Examples of generated values:
// - {__proto__:null,"id":"fffffffb-c066-4b8c-bfff-fff076fecf56","age":99}
// - {"age":4}
// - {__proto__:null,"age":4}
// - {"id":"79a18a26-7f2a-44ae-8000-001d24687e88"}
// - {__proto__:null,"id":"00000005-6a47-4c09-b343-053a0000000d","age":24}
// - ...
fc.record(
{
id: fc.uuid({version:4}),
name: fc.constantFrom('Paul','Luis','Jane','Karen'),
age: fc.nat(99),
birthday: fc.date({min:newDate('1970-01-01T00:00:00.000Z'),max:newDate('2100-12-31T23:59:59.999Z')}),
},
{requiredKeys:['id']},
);
// Note: All keys except 'id' will be optional values. id has been marked as required.
// Examples of generated values:
// - {__proto__:null,"id":"90ff29b1-56e2-408d-bf2a-4f6b0000001f","name":"Paul","age":66,"birthday":new Date("2050-04-17T15:35:56.134Z")}
// - {"id":"fffffff5-ffe5-4fff-8000-000b00000013","name":"Luis","age":3,"birthday":new Date("1970-01-01T00:00:00.025Z")}
// - {__proto__:null,"id":"687e2e0a-000e-4000-bfff-fff30000000a","name":"Karen","age":6,"birthday":new Date("1970-01-01T00:00:00.040Z")}
// - {"id":"f6967db5-3699-45bd-b9b6-4b300ca48a17","name":"Paul","age":94,"birthday":new Date("2031-12-18T04:14:25.874Z")}
// - {__proto__:null,"id":"00000009-377c-4856-8000-000d3b05e20d","age":79}
// - ...
fc.record(
{
id: fc.uuid({version:4}),
age: fc.nat(99),
},
{requiredKeys:[]},
);
// Note: Both id and age will be optional values
// Examples of generated values:
// - {__proto__:null,"id":"fffffffb-c066-4b8c-bfff-fff076fecf56","age":99}
// - {"age":4}
// - {__proto__:null,"age":4}
// - {"id":"79a18a26-7f2a-44ae-8000-001d24687e88"}
// - {__proto__:null,"id":"00000005-6a47-4c09-b343-053a0000000d","age":24}
// - ...
fc.record(
{
id: fc.uuid({version:4}),
age: fc.nat(99),
},
{noNullPrototype:true},
);
// Note: If you only want instances coming with the prototype of Object, you can toggle the flag noNullPrototype.
// The prototype of Object carry some extra functions with it: `generatedInstance.toString()` can be achieved on it, it "cannot" without a prototype if no toString was explicitely defined.
// Examples of generated values:
// - {"id":"f24af89b-fff1-4fff-9941-0ed3ffffffe4","age":5}
// - {"id":"00000001-860d-4216-ba28-48790000001a","age":35}
// - {"id":"fffffff8-9657-4e22-93a8-24ed21bdd338","age":3}
// - {"id":"937c1a2c-fffd-4fff-9c7d-d2d200000007","age":2}
// - {"id":"dabdc13e-4e5e-43ed-acf2-062100000014","age":96}
// - ...

```

Available since 0.0.12.

## object​

---

Generate objects (key/values).

**Signatures:**

- `fc.object()`
- `fc.object({key?, depthSize?, maxDepth?, maxKeys?, size?, withBigInt?, withBoxedValues?, withDate?, withMap?, withNullPrototype?, withObjectString?, withSet?, withTypedArray?, withSparseArray?, withUnicodeString?, stringUnit?, values?})`

**with:**

- `key?` --- default: `fc.string()` --- *arbitrary responsible to generate keys used for instances of objects*
- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep?*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *maximal depth for generated objects (Map and Set included into objects)*
- `maxKeys?` --- default: `0x7fffffff` more --- *maximal number of keys in generated objects (Map and Set included into objects)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `withBigInt?` --- default: `false` --- *enable `bigint` \- eg.: `1n`*
- `withBoxedValues?` --- default: `false` --- *enable boxed values - eg.: `new Number(5)`*
- `withDate?` --- default: `false` --- *enable `Date` \- eg.: `new Date('2020-10-14T16:52:36.736Z')`*
- `withMap?` --- default: `false` --- *enable `Map` \- eg.: `new Map([['key', 'value']])`*
- `withNullPrototype?` --- default: `false` --- *enable objects not defining any prototype - eg.: `Object.create(null)`*
- `withObjectString?` --- default: `false` --- *enable strings looking as string representations of JavaScript instances - eg.: `"{}"`, `"new Set([1])"`*
- `withSet?` --- default: `false` --- *enable `Set` \- eg.: `new Set([1, 2, 3])`*
- `withTypedArray?` --- default: `false` --- *enable typed arrays for ints, uints and floats - eg.: `Int8Array.from([1, 2, 3])`*
- `withSparseArray?` --- default: `false` --- *enable sparse arrays - eg.: `[1,,,3]`*
- `withUnicodeString?` --- default: `false` --- *change the default for `key` and `values` so that they produce unicode strings with non-ascii characters --- shadowed by `stringUnit`*
- `stringUnit?` --- default: `undefined` --- *customize the set of characters being used by the `string` arbitrary*
- `values?` --- default: *booleans, numbers, strings, null and undefined* --- *array of arbitraries producing the root\* values - \*non-object ones*

**Usages:**

```
fc.object();
// Examples of generated values:
// - {"T>\"C9":false,"yHBAjk":{"<uc'a%TWVL":undefined},"\\7PeD/-o:":true,"PW'CFh3Pw":[-7.214519610151173e-299,false,true,null,2030234130078961,null,-8273957629958170,"",undefined,-8.179494320148384e-94],"2$1~":[-3282804867866377,false,4298380906242337,[[7564146043215021,"VYH","h","",false,"%ds7#kDfYS",3.578123265927531e-219,-354088372170986,-2613507181137057],"U,pa$"]],"3W":[-6.675234143629247e-99,"vV 'iQL3",[true,true],"",-5.0163002484267276e-251],"4A B6S":-8850782960808458}
// - {"]iD\"27;N":"Q2znA<",">|{G|F':f":[-3.4364134630258427e+167],"::n|?y1":false,"D#\"qgM":["{?Ug/mu`y",4099389896444517,2.8106429365287123e-290,"D0u7f\\wL4",true,"go\"+a'h~","4~SPYw","}5nUz@cu",false,2.653699048373951e+52],"A*]4kR#":[3.077678585699057e-191,":."],"<{zL{GS_df":{"Kr/`":{"-<":true,"{;L>~A?+b":{":flM\\Ds":-5869183493605743,"":"pH"}},"C8iO":false},"w;c[ifHPI":[null,-1832455907117025,"46q)#d^l1&","",-5.074102272041778e-260,3155691818471737,false,-2142427046048884,"$vG2"],"":2792379101188081}
// - {"(TjI84":{"!ax5yBXr#":1.7962464671949172e+244,"H3C1OZ-CE`":undefined,"bB^5Yz!cI":["*Wn,'",7.690509123279207e+227,undefined,5852017543054509,1.0974361021126729e-16],"1!Tq":"Y"}}
// - {"\\YeS$":true,"\\Cx>":[null,undefined,5667732388716951,"r:-4=`eKn",true,undefined,-1.0161624651353362e+89],"kwF$1q'lm\\":undefined,"":7427664738904881}
// - {}
// - ...
fc.object({
key: fc.constantFrom('a','b','c'),
});
// Note: Keys in ['a', 'b', 'c']
// Examples of generated values:
// - {"a":5434039340410617,"c":"6C&YYy&I"}
// - {"b":[[undefined,null,undefined],["M?",-5580220830100695,"-",false,1.0406508739549715e-195,undefined,",<]u[K6BWe",7191393626793647,true],"xlSjDQL"],"a":[{"c":null,"b":-3.31044629414266e-203},[5.08501079708449e+64,true,"To7_sk",-7813867695183313,undefined,-2.6288856620187387e-300,true,"opc$","},.h%"],"_aa%]B"],"c":""}
// - {"c":[null,true,-5103135698626634,true,8.640826035376584e+129,"BQxVJft(?",-1.5564132973251761e-224,-8751473183072760]}
// - {"a":null,"c":":M2(J"}
// - {"b":[],"c":true,"a":{"c":undefined,"a":1.4812341361081706e-90,"b":3.0694085912031733e-265}}
// - ...
fc.object({
maxDepth:0,
});
// Examples of generated values:
// - {}
// - {"":-2661215485674034,"xc\" _":5.122556662839035e+30}
// - {"EjK.b?^O":"D1$L","zDJWs":"","s ":true}
// - {"":"","r ":"f96g[G4Ta","Lo":-9007199254740982,"y?D0":-4.029795204858185e-145,"{k\"":"4Eg!e$X&!","!#\"{;[r|":true,"ElpSy!":undefined,"N_/?":"3|OB->","Ur!\"":8.561972111917054e-150,"whbHaYv(9":undefined}
// - {"i<\":q":-2.6171334135337624e-291}
// - ...
fc.object({
maxDepth:1,
});
// Examples of generated values:
// - {}
// - {"":{"7xc\" ":"pU","`2ce{'@$":"rT0u2Fz","=\\MDU^x?F":-1634219774646683,"=C_`":":p","5r&":"UHG\"<N"},"9DK]":true}
// - {"EjK.b?^O":{},"D1$L":{"JWsn":" 9%Gp.m0N|"},"?8,E(":{"p7*8>":"O","d!R":"vUwQTwv","Jk<?]Q4kiz":"t9sE;","/a70Mu$":1.553810706514351e-293,"u?*":"};Q4%","":-1.6909038094436722e+50,"jlh42":-1.5681604359387257e+267,";\"OH=dAQ":true,"U<SYe":-6.243528612631655e+287,"_":"q\\b%5"}}
// - {"":{},"r ":{"f96g[G4Ta":3507520577650897,">":null,"-d%v":"YBz[cn","<0u\">P":"?D","1! oW":true,"\\7q5":false,"zx":-3977761363413685,"_":true,"@gK7^Ue YJ":false,"<T.o":-7480996801782140},"y$ );[":-1.7976931348623143e+308,"v&ElpSy!8":{"_/?==2^3|O":null,")[uv*IokV}":" rn(#c","A6[":undefined,"":-7486588236535470},"$1$#S?&Q":5675817337610269,"Z":{},",\"S":[],"F":{"10":-6578471272860074,"djr%&u9k":9007199254740988,"Q9$%":-9007199254740972,"_Ziwm4T":"$__prot","WgRxy<]":true,"?k@":null,"!^!":-3e-323,":NCTp":-8325747361775351}," &HDDGxQP":["Mfwc!n",true," g\"",true,5924336580000517,-7.4e-323],":,":{"nXS#E":false,"bi":-9007199254740972,"":"6","W#/":false,"Ls^d:;":-9007199254740954,"i~$s&":true,"key":2.1892316382848086e-97,"n":"Oc&z\"P0","8\"W{q":7287039842698893,"~Bl!":-3.7948918096071375e-76}}
// - {"i<\":q":9.4e-323}
// - ...
fc.object({
withBigInt:true,
withBoxedValues:true,
withDate:true,
withMap:true,
withNullPrototype:true,
withObjectString:true,
withSet:true,
withTypedArray:true,
withSparseArray:true,
withUnicodeString:true,
});
// Examples of generated values:
// - {}
// - {"𐝥򾫽򄓎𥸕򽊶󱂝綖":{"򉘤𿴀􀡹񻞏􃆢󂼾󺉁𤻎󁑹󩨭":"new Number(5.458711183935786e+215)","\"\"":new Set([new Number(-168580940874959),false,new String("𱚏󗿥")]),"𿚔\u0003":new Map([["󵒊󩇣󄠾󹓅",new String("􃷂󅧰􊧮򆬽尢纍񬏖򈢯")],["򂆶𮕉ɠ񩗢󜧡𞯧󥰆𪲳󲴥󏜠",new Number(-3.915309186966617e-201)],["񢬬𬘃񍦎𨴓򌥱򑲮󷋴򧡥𦹎񮮻",false],["󢎆򐵂􍨌𣏓⢋򄓢𰌂􃙼",9.778144932315068e-292],["󥓽򠕉",new Boolean(true)],["񳟟",new Number(7263738133547713)],["􈦶񈫡򒧯񮹡𬲒򈓠","񒂜򡌍􎅹󇤮𪶟򠿺󓸸񒴕"],["񤮇",""],["򰨞𧘻򪣵򄠏",new String("򿺔󴼃򷣧󓀒")]])},"򇔎󻢢򶞇񙿢񏡂󕌴񠪢𤾿򇣦􉫽":Uint8ClampedArray.from([2,167,221,250,25,5,253,3,39]),"񫍋󕪿󿫽񈬌񁷚":new Set([null,-7554992422397568,-17220778063163852213518299424149709632540904753173033601881880719429971665504n,new String(""),new Boolean(true),undefined,-10556040980590440407765974154662897970048173654375365677184296697937171159766n]),"toString":{},"񂱹":[],"𺴕󖼑򠊅𔡹򁵩":Uint8ClampedArray.from([118,211,17]),"n":"new Map([[\"\",-3.847406447449319e-89]])","\u0007\u0013򆡭\u0003諸\u0010\f":{__proto__:null,"񕯄􏿻\u000e\u0000\u000b𪲿󓕲\u0014􏿾":new Number(-7.4e-323),"󟔭򑂬𖄋񉾻𭩼𗿎򹸶臦":"","":23060781171921571898756243128383982884697443490579335692025690551060929342872n,"u򰉠oStr":new String("򻝢󔔲𐬸򁭘񩃟򵶳񍏫𓹹򓠹򴻯"),"􏿼񺆁":null,"󅆲򚏵󪹫񌋬𮏄𚨛󉬐":new Number(-1.3004479422180178e+247)}}
// - {__proto__:null,"򄹝񀱭":Int32Array.from([]),"𹼵񴝊󁬄󔧿􋮓󛶿𐔕򑱌𗶅󤪰":{"\"\\\"[,,,new Number(-4.490174307177352e-198),,new Date(\\\\\\\"-106579-12-08T20:44:48.131Z\\\\\\\"),,,,undefined,undefined,,,,,new Boolean(true),1.9508140793094447e-78,,new Number(-5041235613012303)]\\\"\"":[undefined,30705958287062063809406821421480739232961490015468570116289856317966655176612n,new Number(7.67366369906868e+61),"񾃪񭳵󞹛",-14338777825638388738588125662519091098121465295520758561664196240746398148098n,"򽪟𶟝󻹐򤻰",undefined],"𜺼򵹶򾏬셎":[,,6140240271527813,,,,,,,,,,,false,,,-6137666721580411,,,new String("󴣠󼶓򚜞"),,,,,,,,null],"򑲴򻳡􋡔񊒜𙽍󦽴񵺆":{__proto__:null,"񳷠󁲚򆴘눡":2.152516341623135e-119,"񁫹𾙼":new Boolean(true),"򊿬󦚔򝮵񳲢򲌲􆦌􉫴쳟󪐂":-34792858776756117278644791631482107040200676854821362073707882618437886127898n,"󉴖𨻎򳯔񔻲":new Boolean(false),"𢙻򊣐󘗎񫸶𷸭󈤧򀽛򮮭򭎇":true,"򊖠󢰫񝳥򞚬󒣵𲙼":new Date("-126777-12-31T00:18:16.754Z"),"󱙹򒼡񢝥𹊐󜪾\u0002":-3.099084554742164e+111}},"񧼢⑄򯫓":{__proto__:null,"񈡳𘾂򧨁":true,"񤆑󧝂񊥺":new String("񵲍"),"񒏘򌃲򨣶":new Number(-472028172876604),"󁏧򭍚񷓈񅯈𓩹𓐑󰢯𚵂":new Date("+037493-02-01T23:18:48.960Z"),"򽎳򜮺򮯕󗤶":new Number(-2.3716909519897796e-150),"򙧂񣉩򘷅􆌢Ձ񶘪񿕝񒡈󇑄":3040157920756017,"񀷖𜖷𮁫򸆲򟡒᲼󄧦򿰥􎶚":new String("𬡟ﰖ򚍼򀴋񍔿𔕫􉯘𳷍򸼐"),"񚧴󢇨󈴵󮢽𦱂񕫓񜆂򯠻":new Number(2532454634579329),"new Number(7798002711790977)":new String("𿵁񙙣𫏡੩򗢇")},"򕟴񦙜񀍀򇁢󦌩󐟬񴛬𨩟":"Int16Array.from([7658,22125,-26239])","":new Map([["𳟶󹾂򖴁򃐒󊎋򼊾",Uint8Array.from([])],["{\"󬁲󐀎𪫮𴥓󖀐󹌝򬯺񍳗󕥖󰁓\":34333408565281186912577278712210978660985153156897149000078193251081785567642n,\"󈚛󩩺󗭍񛍍≼򵖏󄋑򵒌󯁹\":-6668764753275173,\"new String(\\\"󕳓򺟝󤩹򼎒򢀆𿙍𸨊󀋭𙘯񮖣\\\")\":3.795018961460958e+53,\"󐅀񹄦⺠쌛򿯪𧡬\":-2839839446815476,\"񼙴\":true,\"󁑳򅟧򶝕򟖊򳢰\":-1671767290528202,\"\":{\"򘟍󎧗𮘒􊀾󠄵퟇򓘱𺾚󙶖\":new Date(\"-182354-05-21T10:29:26.023Z\"),\"򨔔򽗏𨌰󵫙񁾀\":true,\"󞕏𛜺𰯬򽡏𘽗󉗣𪮾򭺷𕑆广\":new Number(4536131695635927),\"new Number(5.117983040436394e+69)\":-7686272122101106,\"\":new Date(\"+256755-02-25T04:42:50.620Z\"),\"󽤀񬸬򡟲\":new Date(\"-128815-01-15T07:27:05.561Z\"),\"𳊸𾹜\":new Number(1918554798446691),\"򽛉򑗧񰵱񗛇󯍸󴮴悵򾛼\":-7170578019637745722012682538451894114914867188472658657746570163170180233272n,\"𒩶󠑋󴌖򏜧\":null,\"󉺌󢙯\":undefined},\"񶴅񺎪񏀮囖􈲊򮕑􆸠\":new Number(-1.5469047808995759e-83)}",new Number(-1.6148448506765371e+22)],["󽰾񹓍󥦙𓾬񫈘",false],["𛏒񿽁኿􎽶񧦬񪴐",new Number(-5.826528261511027e+274)]])}
// - {__proto__:null,"󿤡񜰁󠸂":new Set([]),"\u000e󫴜𓍚":Int8Array.from([-46,-72,-12,-70,56,120,-31,124,52,-33]),"key":{__proto__:null,"new Map([[new Boolean(false),-1.441300349275421e+148]])":null,"󏩄񵥥󶀻𬇆񈼦򴙈𑌄􆿙򏰠򧵰":new Number(-9.77072430925001e+272),"񔼚𥝸𳘔񅡾򂆇𔚋򜟛򫡁":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,Float64Array.from([2.4327003204327724e+59,-2.3055577399170182e+238,-1.220016394687611e+278,-1.748990183698356e+145,5.1394770441041245e+137,1.8234041126551352e-121,1.094040461150623e-206])],"񠂉𦪹𮯙񈘰􉒷":new Date("+193195-05-28T11:42:59.440Z"),"arguments":new Boolean(false)},"󇟹򇁊򙿌񍯱򯹵񮤗𗬩񓬡":"[48]"}
// - {"򱗫":new Map([]),"𷢑􉎦񯢉󅌓󤑵򙺿":Uint32Array.from([1826204194,2417112435,3273159995,841539727,2942351593,1381423026]),"𰂻󎂹򅳾򈼥򧇮򿌮":new Map([["",new Number(-6836057403391378)],["new Date(\"-258207-08-18T07:39:50.664Z\")",[,,,,new Number(-1735757222382761),,"",,,,,,,,6278459942747999807080033191647922344096494191174452342262690828457892656925n,,new Date("-214251-08-20T20:06:26.663Z"),"􂢕􅪴",,,,,-8.079750906287982e-78,,,,,,,-10369827297499097554212502537348689556523576568069581751719816193396600267713n]],["󼓊񅪿򣇶",new Number(-1.2812321053022621e+131)],["􁵚򛩫񠋢𥼄󸮬",new Boolean(false)]]),"񄌺󫢀񲏑򥺪򤥲":[,new Set([-2.788886288154636e-108,-23176574200426617453381026519592490931781297414960701128396696332593406842216n,new Number(2614490335475399)]),,new Number(1.3866106311527406e+165),,43453764951860924684879533858074278006216090104086631170894299857984787714606n,,,,,,"򟠉󧶴𦱓󚭏񾞙򣻶򟉡",,,,,,,,-40062093534296937501748016010257849709288299651944876442585854714003078112906n,,,,,,,new Date("+120633-04-04T13:13:22.144Z")],"񽁜綌𩕊򳭱":Uint8Array.from([187,25,149,37,145,210,143,27]),"񘮵ﾌ𾡰񕾃񀙹𘚢񪵖":"\"new Date(\\\"-062403-09-14T13:14:48.775Z\\\")\"","򥊋󏳬𖱀󼪉򡭓񗓱􇲝󯒘":new Date("+252329-01-04T02:02:12.616Z")}
// - ...
fc.object({
depthSize:'medium',
maxDepth:1000,
});
// Note: For the moment, we have to specify maxDepth to avoid falling back onto its default value
// Examples of generated values:
// - {"jlRI2'7":[[-3.6634432860547786e+51,{"7m=0":"&fz",")!":[undefined],"N":null,"I=u8m^VR":{"S29":undefined,"b:<?mCQkVd":8.940058015250812e-271,"qAHv?":"P:w<OcJP","Q4ZF|M":108779479352173.86,"!)!UV~9":false,"I3<aagCu9":-590557752051460.5,"y":false,"u<*Y#T@Y3":8165685034312269,"<W;Qzu8":"&%Xv","V":null}},-3.121430328628285e+162,undefined],["","phW",-1.9464950299309262e-17,-4.226362328068501e-212,3.1522566190934685e-186],{"4":1.3897601044135302e-295,"}nkw<.)":false,"8h9gD":true,"r<!":true,"]f/sR%^9Hj":"H&)","cHm kh":[-4.396365385982941e+29,8089452988759541],"wln.":{"Ahv<l]:|":undefined,"w*OEhL":-1.1354700894005589e-291,"W39)u&":true,"":true,"SX4e'Hj":false,"G\"yRzF":false,"\\,tcQ6$#j":"zCGHb]","yvRw":undefined},"":-3.8760248323787517e-97}],"{?F(":{"R\\94!x6Q":[[],{"i@iro5[fKd":{"Pq*;vr;c":3433121904518719,"E((9PS":"5|Tp","y/Jo0":false,"{\\F8{l":true,"3@9J1{9?b4":{"JqLj#8%IVM":-4.345111006146924e-119,"E#h ":-1.4458501693886183e-53,"Z":null,"ek":7.627014306073162e+35,"":5211735920391165,"b":"#T"},"Q.$%&J*hg1":true},"MWBjU":-5998627330219094},{"99\\QXu]D_":0.049788359044109755,"|< 0vgmqeG":",","":true,"r=QT":6.720558051229312e-144,"G++i!hk@":4647057243076279,"E&ng)(~G":-4.1051239898293556e-219,"JtBUMq":null,"q`kX22":""}],",0sD":[-2291925253002477,-3680809186684411],"d>}":{"WPP5*6Cr":{"\"1":null,"2)T":-8377951956507916,"9HF3{V8tEb":2280334561885641,"!$%Rey@}":2528584674341843,"d^!9":"8@$-sOGr",":-?}' ":"u@f","qP":-4245571069522892,"NFS,v8,3B":"~fdG,gkK3"},"/G;o":[null,-8242886212680521,-6105795529017969,2.4795920784861635e-58,true],"|W*45":"","@/:$YWe":true,"h[&":-7.300258930257669e-188,"zj=S68":697925372625389}}}
// - {"<6Fmm`4}Bu":[{"wimM?[D_l":"-"," cLYEh":undefined,"~M=,<]":undefined,"":{"+5V>":true,"x'xlSjDQL":[1802778402004233,-8616465840854132,true],"eG?2W":false,"y":undefined,">sMsRX 6y":-1.7189385776940326e-264,"SS%K~_":-1.0690658255104117e-299,"0WR\\L":false,"#}D{":""},".Df)X2<":-2202090815862342,"HZd+N":[undefined,{"C_H~4X4q":2709965599750143,"Qz2":null,"[*~=DXH":"yZi"},undefined,":L=\\O","5UeV}~.'",-3.31044629414266e-203,false,false],"*a@K.To":[false]},false,["Gmfz&O=K2o",-7.403319311837875e+241,[-3.0613655782090207e-27,true,"a%]B","","b9x}"],null,4179679971001965,{"~Ve#ZG6Mb":null,"i:SSd7":null,"Jf4P2mz":100760271.13220443,"W)k":"zI&n-d(wbC"},undefined,-7286446844918941,-4.039967891793219e+56,1906820233849569],296844346754593,{"S5rX+-":[-1.1392462164399509e-198,[-9.535024608921826e-271,"Gq;"],true,undefined,3.5981254940269306e+81,"T)c')v9r\"A","oO5oP+'",":M=m",-3.944166286120164e+33,-6205742952976482],"YTl":undefined,"I<,TFUmM":{"&A$":{"oKj$u2ew":-775022.3461122828,"fF^|`":"+8a:]/|E?","$/Mx":"`","U'SU4y9WL":{"DR(Vw":"sp^5@HyTyg","\"x":{},"=DrKR^41":":eTPKH{|","/Jw.":"4*2.d43","XX0jo":true,"8I+]uE,~f!":"KU","U#XUyT":null,"}]0G`S":false,"R":8685784240008809}},"":1.620440900490254e-107,"rD8XT^&[Z|":[],"gXifr1xy":[true,true,false,undefined,-2.6592975170538685e+219,-7514943573617259,4.4832607392026617e+86,4960815038961037,"W3=9"]}}],"_":[[],{"^B!_l":"/D[S5Z2zWA","jfZ":"F$uvKnq","Lguy)#r_IX":1.2359628335811745e-97,"1;":3821770058210129},-6.904446105243352e-71,-1.0297835727619694e-278,-3.5748966927106464e-37,"JVd6D|",347573441937437,-2.359579050814135e+229,false],"G2jJT":{" ":[2.951809015572984e+77,".H:K~5Wa",7.880546788741649e+254,"#I5H XXI",-256426800988548,"'U|*?Z{R","@xJ]",undefined],"o=P":{",lv,|":{"Qn":{"f\\bt0%":[],"4pdV~v":"tx8>?nX","m1<<":[false,undefined]},"zAzTM_<Pw":-5.140247429260173e+64,"p":{"iiQQ43":-3035959157448065,"o":true},"8IXbO":2.6967794816849864e+174},"R\\Jgqd":"","P5/1GS5P|r":"Hl~Qiu>"},"":{"":{"O<}lhD_VJ":"KRa",">ARE|":2.105709110120377e+291},"mt-5CHw":[7281056895309909,undefined,-1.0832106067775677e+83,"n",1.1148533710500072e-144,undefined,9.612492054183178e+254,{"w^7m1":"x","gAJ":1216468896413103,"3P.":undefined,"lH`PK3XT":true,"M":true,"V'$":1366229033719073,"":-5449296540214400,"dDV4":"aN-1$oz","o`6":"sf1J9i@[<","7IQ!VE)":"oRO6+-@-4"},-6617712369339759,false],"!J%w/m":true},"bM\"!Z":false,"9}/":{"U/N0":-8.797962526796922e-300,"Ians":"_<d"}}}
// - {"QP~oe^k":{"":-6.297226029379872e-90,"nTBQxV":["&JgF{Ts",-2.2023434094817895e+57,"}",{"J[G5),H":2896817514483901,"+;.1i@":"3_AK_j3Me","Wr":5040983497678121,"":null,"y":"T","(3w|Ctz":"m?(hO3U]U","7,-Dk":1.097665475704934e-37,",e'\"`":-1.3824131271867126e-137,"+":true,"sT{T U":"jrWM)PTK4"},"ShcW"],"Uy":[[-2.5e-323,6e-323,true,"*?C?",{"09gDr)":-6631066354524675,"abW0O`G7w":1.7975641982015258e-218,"24R2wI@m8":-1.4231998566419938e-152,"":"'(yHIDy8.","iJhH@CoZI":-9.306087735675537e-117,"[~Su5uc":true,"c2>U#O#":-2.554930250476925e+50}],9007199254740989,{"7":false,"1)eo[:ZLR":-1680458957018741}]}}
// - {"Qynb2&R:":"kprototy","S/zpO]":-6.610312155890988e+164}
// - {"gIkH":{"M5R7w_$C0":false,"":"2hHGwqBi]","4?NZ(<btD":" ","tb":null,"[tE~r,Tp":3272117996070697,"9% ;$":{},"gdZ7p.rOM":-1.8456309562500985e+216,"nnTx}3z+B":true},"8$":[{"@p3P":{"`%:j4)tY":"[/RpNyjA8","F;>I\"l0!1":"}1","-yFgaGXx":undefined,"O":false,"MSxw E&*":2053216282867765,"gU$Tvn:":6468393373138605,"N":false,"\\EZq71Vg^g":-7351123399757278},"N.F!HH+u%":[]}],"]{\\s~Bq":{":=u^*,k<e":{"Z":-2.943842010162528e-293,"QB":[undefined]},"kJ&t":[],"bJVUgr{%4_":-2229105556514824},"L":{},"CjiJ,/q;S":{"wYd/nde0":[-7641753278026031,-2.3215299537372015e-307,{"#VlxP":".o9D##","Xr1BGSJ":"\\\\sy]h"},8501134920229827,"e Ok` 1(",48256.5854714529,"J-"],"(n":undefined,"n+ABlR":"k ","q3":{"L}h]4*9>N@":8318651930088765,"UD+Lz6":" 4","":-5138984880950414,"i":true,"pL\\w":"<9","z3M6\"X -":1.3642276018956944e+61,"uqHu":9.837488911132902e+60},"v<=P0L":"b(an[(81","sCs`< ajc":true},"aq#; 4":[false,"zHdkS","u~SK","A$`ATe|+,",true,"/'",false,[2065404388717637,false,"fI58Jykr","6"],4.058136433038056e+268,"^z<Hm'"],".q^":null}
// - ...

```

Available since 0.0.7.

## anything​

---

Generate any kind of entities.

**Signatures:**

- `fc.anything()`
- `fc.anything({key?, depthSize?, maxDepth?, maxKeys?, size?, withBigInt?, withBoxedValues?, withDate?, withMap?, withNullPrototype?, withObjectString?, withSet?, withTypedArray?, withSparseArray?, withUnicodeString?, stringUnit?, values?})`

**with:**

- `key?` --- default: `fc.string()` --- *arbitrary responsible to generate keys used for instances of objects*
- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep?*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *maximal depth for generated objects (Map and Set included into objects)*
- `maxKeys?` --- default: `0x7fffffff` more --- *maximal number of keys in generated objects (Map and Set included into objects)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `withBigInt?` --- default: `false` --- *enable `bigint` \- eg.: `1n`*
- `withBoxedValues?` --- default: `false` --- *enable boxed values - eg.: `new Number(5)`*
- `withDate?` --- default: `false` --- *enable `Date` \- eg.: `new Date('2020-10-14T16:52:36.736Z')`*
- `withMap?` --- default: `false` --- *enable `Map` \- eg.: `new Map([['key', 'value']])`*
- `withNullPrototype?` --- default: `false` --- *enable objects not defining any prototype - eg.: `Object.create(null)`*
- `withObjectString?` --- default: `false` --- *enable strings looking as string representations of JavaScript instances - eg.: `"{}"`, `"new Set([1])"`*
- `withSet?` --- default: `false` --- *enable `Set` \- eg.: `new Set([1, 2, 3])`*
- `withTypedArray?` --- default: `false` --- *enable typed arrays for ints, uints and floats - eg.: `Int8Array.from([1, 2, 3])`*
- `withSparseArray?` --- default: `false` --- *enable sparse arrays - eg.: `[1,,,3]`*
- `withUnicodeString?` --- default: `false` --- *change the default for `key` and `values` so that they produce unicode strings with non-ascii characters*
- `stringUnit?` --- default: `undefined` --- *customize the set of characters being used by the `string` arbitrary --- shadowed by `stringUnit`*
- `values?` --- default: *booleans, numbers, strings, null and undefined* --- *array of arbitraries producing the root\* values - \*non-object ones*

**Usages:**

```
fc.anything();
// Examples of generated values:
// - {"iWE$U_3M":-1.1761153457907281e+64,"L8Yr[Em":false,"\":5S":false,"o*&t(b":"{e~\\gX0Ed","oZ":null,"1_0O9":"foL+as'","":[1.0463183151057806e-218,null,true,"`","/|iF"],"Y":"x\"","YP$;D_Cs":-2.406148264784688e+274,"c!lltdK:(_":"bD'arF"}
// - {"3O":[undefined,false,[true,-3.9051738307924134e-153,4.149228362205894e-119,false,false,true,false," D%}6m0",2.799370866495145e-203,-4.091042595321496e+221]],".J":[{"Og*S":"","I9?z([s":-1.1821534452382826e-198},1.7790896502987502e+276,true,-2.376179675473729e-295,true,true,undefined],"~MS":"key"}
// - "ref"
// - null
// - {"key":{},"MTvN8AE0gi":[3405288540635877,"P]z!2",true,-2.387521190971066e-60,null,-3698869638931618,";|s%~j+NA",-6.1815138747104425e-266,{}]}
// - ...
fc.anything({
key: fc.constantFrom('a','b','c'),
});
// Note: Generated objects will come with keys in ['a', 'b', 'c']
// Examples of generated values:
// - [true,true,null,-5.6688453874368936e+48,false,2014694191684145,"LV$%~%",undefined,"_`qj6\"kX[",""]
// - {"b":{"c":6997371217031069,"b":8609382555061735,"a":5.120009133889531e-261}}
// - ""
// - "Y}q^/9i*"
// - 3467734424335213
// - ...
fc.anything({
maxDepth:0,
});
// Note: Only root values
// Examples of generated values: -8578863785414675, -4e-323, 5.4e-323, 1.9666983140272718e-262, -34...
fc.anything({
maxDepth:1,
});
// Examples of generated values:
// - 1.1084525170506736e-156
// - ["&",-951559264941376,",M9|W?"]
// - [-2218061790593050,30]
// - [-8177572456165737,"5",undefined,-6845939437559701,false,"8erNtuc"]
// - -6827243000782837
// - ...
fc.anything({
withBigInt:true,
withBoxedValues:true,
withDate:true,
withMap:true,
withNullPrototype:true,
withObjectString:true,
withSet:true,
withTypedArray:true,
withSparseArray:true,
withUnicodeString:true,
});
// Examples of generated values:
// - {}
// - Float32Array.from([])
// - "񝾎򹬲񗑉󖑪"
// - [,,,,,,,,,,,,"𧴘񕠬򺀇򼗤򡎴򞪞󥻸򰮤򐑑",,"𰭜󈟛򐠛񣘮񺠢􏍎𕾴𐺫񪎯񢔆",,-5.3675543270540993e-284,[new Number(1657701218649805)],,[new Date("+220046-10-23T23:52:55.336Z"),new Number(2.1773262360012777e-144)],null,,new Boolean(false),,,undefined]
// - [,,,false,new Number(-1.599410877348038e+79),,43191232019149202439704040983801711618185659722841871029570904665841503300146n,,,,,undefined,-464687703824889,,,,,,,,,,,new String("򵠣󈱷󘠦񱵴"),,,,false,-1.2182093470461338e-165]
// - ...
fc.anything({
depthSize:'medium',
maxDepth:1000,
});
// Note: For the moment, we have to specify maxDepth to avoid falling back onto its default value
// Examples of generated values:
// - [true,true,null,-5.6688453874368936e+48,false,2014694191684145,"LV$%~%",undefined,"_`qj6\"kX[",""]
// - {"`?f\"vcr":{"XW71":{"zXAq\"Z5Q":true,"@qs0m!":[5.120009133889531e-261,{"o3i[OWP`=F":{"":4.068510532307745e+281}},2487404948730847],";TuQtZ&=7m":{"'($":null," bkaeV":{"":true,"Aw9+YG]!":-6.879800144762926e+244,"n?L!B#R)n":"g5","'mq.#%I":1.3221798495494814e-101,"}E==:3Bp^T":-7996608749108864,"m":2.6223863023846673e-44,"w|q":3.70106922442221e-186},"!-V+{4":"\\","jwvaZ8":{"zB!nm|":7757208992281711,"h":-4.149080249381332e+195,"aiDLh":"","(Hs)$P*P":1.190747970776708e+91,"%?nT~X[N~\\":undefined,"`.r,*R;I":true},"":[-6523958486123735,undefined,1.2305151888129762e-204,8115823674866317,null,false,4.434127565304523e-183]}},".sfPOsH*41":[-5.01979880119724e-255,"i",-1.4081703508890424e+232,{"m!?ZW`:":"Y{P?$jVp","zq$@`":"fP>v)%C","sE,":[undefined,2467017295150935,[false,1063781909072521],"/>V;[_hAQG","[q:F",1.7094514624379897e+303,"",4.022046823766959e-77,true,false]},undefined,null,-5117919068097772,-1.0529463229722598e-11]}}
// - ""
// - "Y}q^/9i*"
// - 3467734424335213
// - ...
```

# Typed Array

Generate typed array values.

## int8Array​

---

Generate *Int8Array*

**Signatures:**

- `fc.int8Array()`
- `fc.int8Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `-128` --- *minimal value (included)*
- `max?` --- default: `127` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.int8Array();
// Examples of generated values:
// - Int8Array.from([122,3,-124])
// - Int8Array.from([75,-49,-14])
// - Int8Array.from([-125])
// - Int8Array.from([-38,57,44,43])
// - Int8Array.from([-5,3,-122,-7,-59,-122])
// - ...
fc.int8Array({min:0,minLength:1});
// Examples of generated values:
// - Int8Array.from([94,100,90,3,30,8,19,78])
// - Int8Array.from([1,123,4,3,0,48,125,86,2,91])
// - Int8Array.from([5,58])
// - Int8Array.from([126,5,100,127,123])
// - Int8Array.from([97,6,121])
// - ...

```

Available since 2.9.0.

## uint8Array​

---

Generate *Uint8Array*

**Signatures:**

- `fc.uint8Array()`
- `fc.uint8Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `0` --- *minimal value (included)*
- `max?` --- default: `255` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.uint8Array();
// Examples of generated values:
// - Uint8Array.from([146,85,17,121,55,177])
// - Uint8Array.from([])
// - Uint8Array.from([10,89])
// - Uint8Array.from([103,180,114,14,118,92,72,6,30])
// - Uint8Array.from([83,73,147,245,64,203,161,246,99])
// - ...
fc.uint8Array({max:42,minLength:1});
// Examples of generated values:
// - Uint8Array.from([16])
// - Uint8Array.from([13,11,41,33,31,7,28,4,17,38,19])
// - Uint8Array.from([15,11,30,9,12])
// - Uint8Array.from([5,14,37])
// - Uint8Array.from([28,3,6,15,0,4,6,17,38,1,40])
// - ...

```

Available since 2.9.0.

## uint8ClampedArray​

---

Generate *Uint8ClampedArray*

**Signatures:**

- `fc.uint8ClampedArray()`
- `fc.uint8ClampedArray({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `0` --- *minimal value (included)*
- `max?` --- default: `255` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.uint8ClampedArray();
// Examples of generated values:
// - Uint8ClampedArray.from([111,195,177,66])
// - Uint8ClampedArray.from([122,171,50,200,198])
// - Uint8ClampedArray.from([118,94,97,138,117])
// - Uint8ClampedArray.from([53,190,83])
// - Uint8ClampedArray.from([121])
// - ...
fc.uint8ClampedArray({max:42,minLength:1});
// Examples of generated values:
// - Uint8ClampedArray.from([1,0,26,2])
// - Uint8ClampedArray.from([18,2,27,0,37])
// - Uint8ClampedArray.from([29,1,33,5,40,40,14,10,15,22,39,11])
// - Uint8ClampedArray.from([1,14,26,2])
// - Uint8ClampedArray.from([0,5,4,0])
// - ...

```

Available since 2.9.0.

## int16Array​

---

Generate *Int16Array*

**Signatures:**

- `fc.int16Array()`
- `fc.int16Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `-32768` --- *minimal value (included)*
- `max?` --- default: `32767` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.int16Array();
// Examples of generated values:
// - Int16Array.from([7570,-29355,-239,4473,-969,-5199])
// - Int16Array.from([])
// - Int16Array.from([4874,-12711])
// - Int16Array.from([-12441,-7244,32626,1550,-5002,20572,-9656,-29946,-5858])
// - Int16Array.from([-5805,-14007,18067,18421,-10176,-13877,-24415,29686,-26525])
// - ...
fc.int16Array({min:0,minLength:1});
// Examples of generated values:
// - Int16Array.from([4007,21551,9085,2478,16634,3581,7304,29246,12872,23641,22492])
// - Int16Array.from([954,19772,29823,20600])
// - Int16Array.from([32767])
// - Int16Array.from([19919,1,14,19008,25737,3165,3])
// - Int16Array.from([24908,7,7,24039,1])
// - ...

```

Available since 2.9.0.

## uint16Array​

---

Generate *Uint16Array*

**Signatures:**

- `fc.uint16Array()`
- `fc.uint16Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `0` --- *minimal value (included)*
- `max?` --- default: `65535` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.uint16Array();
// Examples of generated values:
// - Uint16Array.from([22507,50336,29220])
// - Uint16Array.from([3,56136])
// - Uint16Array.from([2769,5763,11647,10948,13743,23390,60319,8480])
// - Uint16Array.from([10545,40641,64196])
// - Uint16Array.from([10645,45125,552,37585,55875])
// - ...
fc.uint16Array({max:42,minLength:1});
// Examples of generated values:
// - Uint16Array.from([40,10,16,0,0,41])
// - Uint16Array.from([22,28])
// - Uint16Array.from([24])
// - Uint16Array.from([38])
// - Uint16Array.from([1])
// - ...

```

Available since 2.9.0.

## int32Array​

---

Generate *Int32Array*

**Signatures:**

- `fc.int32Array()`
- `fc.int32Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `-0x80000000` --- *minimal value (included)*
- `max?` --- default: `0x7fffffff` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.int32Array();
// Examples of generated values:
// - Int32Array.from([581737874,363728213,1849261841,2086900089,-739607497,-1663538255])
// - Int32Array.from([])
// - Int32Array.from([-959081718,-1066774951])
// - Int32Array.from([1932414823,-1904516172,-1076953230,327779854,-2127205258,-1298673572,503994952,-1638200570,-1729271522])
// - Int32Array.from([-1151637165,-722646711,-1773418861,-1345402891,161175616,-1982117429,68362401,-1837239306,-204728221])
// - ...
fc.int32Array({min:0,minLength:1});
// Examples of generated values:
// - Int32Array.from([1785106343,925226031,718971773,1586792878,400900346,1689947645,96279688,1693807166,438809160,1047878745,2063128540])
// - Int32Array.from([1155662778,398052668,504460415,572805240])
// - Int32Array.from([2147483628])
// - Int32Array.from([688082383,20,17,896059968,1869735049,922750045,18])
// - Int32Array.from([1794203980,11,13,1308253671,3])
// - ...

```

Available since 2.9.0.

## uint32Array​

---

Generate *Uint32Array*

**Signatures:**

- `fc.uint32Array()`
- `fc.uint32Array({min?, max?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `0` --- *minimal value (included)*
- `max?` --- default: `0xffffffff` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.uint32Array();
// Examples of generated values:
// - Uint32Array.from([3829422059,2425734304,2138206756])
// - Uint32Array.from([19,1046862664])
// - Uint32Array.from([3669232337,2464093827,3748932991,1057761988,4236064175,4122041182,1618733983,882909472])
// - Uint32Array.from([269035825,2242944705,2375219908])
// - Uint32Array.from([755444117,555135045,2658796072,3505820369,3087063619])
// - ...
fc.uint32Array({max:42,minLength:1});
// Examples of generated values:
// - Uint32Array.from([40,10,16,0,0,41])
// - Uint32Array.from([22,28])
// - Uint32Array.from([24])
// - Uint32Array.from([38])
// - Uint32Array.from([1])
// - ...

```

Available since 2.9.0.

## float32Array​

---

Generate *Float32Array*

**Signatures:**

- `fc.float32Array()`
- `fc.float32Array({min?, max?, noDefaultInfinity?, noNaN?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `-∞` and `-3.4028234663852886e+38` when `noDefaultInfinity:true` --- *lower bound for the generated 32-bit floats (included)*
- `max?` --- default: `+∞` and `+3.4028234663852886e+38` when `noDefaultInfinity:true` --- *upper bound for the generated 32-bit floats (included)*
- `noDefaultInfinity?` --- default: `false` --- *use finite values for `min` and `max` by default*
- `noNaN?` --- default: `false` --- *do not generate `Number.NaN`*
- `noInteger?` --- default: `false` --- *do not generate values matching `Number.isInteger`*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.float32Array();
// Examples of generated values:
// - Float32Array.from([])
// - Float32Array.from([-12.122719764709473,-8057332.5,-8.5333065779299e-31,4.203895392974451e-45,-1.401298464324817e-45,2.5223372357846707e-44,-0.15196290612220764,-3.4028190042551758e+38,3.741597751304629e-28,1.401298464324817e-44])
// - Float32Array.from([-3.24799757855888e-21])
// - Float32Array.from([-13627700375715840,-2.4350556445205305e+37,-1.392195136951102e-9,-2374.965087890625,4.244262896690998e-8,-5.161676815695077e-19,-0.20675736665725708])
// - Float32Array.from([1.7366975231216193e-20,-2977645988174364700,2.589363879539297e+31,1.8031471498217155e-12,4.5007039497195254e+25])
// - ...
fc.float32Array({minLength:1});
// Examples of generated values:
// - Float32Array.from([2.0374531922717765e-11])
// - Float32Array.from([30.016468048095703,2.1674793240938824e+30])
// - Float32Array.from([-2.6624670822171524e-44,-8.629187158980245e+32,-3.4028226550889045e+38,-3.0828566215145976e-44,-170087472,90606641152,2.449428132964808e-27,6.091665951650796e-23])
// - Float32Array.from([3.4028190042551758e+38])
// - Float32Array.from([-3.4028190042551758e+38])
// - ...

```

Available since 2.9.0.

## float64Array​

---

Generate *Float64Array*

**Signatures:**

- `fc.float64Array()`
- `fc.float64Array({min?, max?, noDefaultInfinity?, noNaN?, minLength?, maxLength?, size?})`

**with:**

- `min?` --- default: `-∞` and `-Number.MAX_VALUE` when `noDefaultInfinity:true` --- *lower bound for the generated 32-bit floats (included)*
- `max?` --- default: `+∞` and `Number.MAX_VALUE` when `noDefaultInfinity:true` --- *upper bound for the generated 32-bit floats (included)*
- `noDefaultInfinity?` --- default: `false` --- *use finite values for `min` and `max` by default*
- `noNaN?` --- default: `false` --- *do not generate `Number.NaN`*
- `noInteger?` --- default: `false` --- *do not generate values matching `Number.isInteger`*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.float64Array();
// Examples of generated values:
// - Float64Array.from([])
// - Float64Array.from([-301377788.37725013,-1.7149147913092319e-97,8e-323,1e-323,-4e-323,-2.057106358614005e-7,3.7791002743330725e-63,5e-323,7e-323,-2.7469348785639148e+224])
// - Float64Array.from([-1.1619421936685911e-164])
// - Float64Array.from([-7.651385650429631e+128,-8.869426164279998e-72,4.233071733934197e-64,-0.000002350752021139201,7.038756466481596e-175,126806475960244.08,1.1085581712589228e+178])
// - Float64Array.from([3.477655531645621e-163,8.482885727970808e+246,8.005016653709244e+200,-1.6308036504155555e+224,-1.8149570511597214e-122])
// - ...
fc.float64Array({minLength:1});
// Examples of generated values:
// - Float64Array.from([1.179182805455725e-90])
// - Float64Array.from([33830772.59796326,4.4e-323])
// - Float64Array.from([4.4e-323,-2.0609982364042263e+263,8.629895099097848e+77,1.4155962948371038e-248,-1.9599359241539372e+245,5.117175856556106e-218,3.0325723805645807e-84,-1.7976931348623147e+308])
// - Float64Array.from([1.7976931348623147e+308])
// - Float64Array.from([-1.7976931348623147e+308])
// - ...

```

Available since 2.9.0.

## bigInt64Array​

---

Generate *BigInt64Array*

**Signatures:**

- `fc.bigInt64Array()`
- `fc.bigInt64Array({min?, max?, minLength?, maxLength?})`

**with:**

- `min?` --- default: `-18446744073709551616n` --- *minimal value (included)*
- `max?` --- default: `18446744073709551615n` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*

**Usages:**

```
fc.bigInt64Array();
// Examples of generated values:
// - BigInt64Array.from([7780786618611046569n])
// - BigInt64Array.from([3321688158611740109n,5336242056478727470n,-620335768501958405n])
// - BigInt64Array.from([])
// - BigInt64Array.from([7655040194619891365n,-609033188233272247n,-3377172262367663000n,-6575651731349736555n,-194007844161260784n,2956209257781779103n])
// - BigInt64Array.from([-463701052756207261n,7371548932979131799n,-7877987368304813406n,8509643815846265359n,-6285842279948105755n,-7977810195168624590n,-8632461560578801824n,-764227837462381748n])
// - ...
fc.bigInt64Array({min:0n,minLength:1});
// Examples of generated values:
// - BigInt64Array.from([5794385668286753317n,9223372036854775800n])
// - BigInt64Array.from([7250361649856044302n,4310753745190106570n,5393690158673113485n,6842387272625948355n,4514914117086513826n,4933290198875114684n,4355527851938090954n,5722670493121068189n,7946781874214666176n,5681273141705345352n,3400318954538433694n,9140895324085985125n])
// - BigInt64Array.from([7017002079469492577n,8064792390940992730n,5210011569993732916n,7871654509320106441n,5389875796080866293n,842396779505087393n,3513990769024304909n,7624709996764891089n,8471604102740905558n,2981767532172910000n,2216100277924575184n,3375835224553658028n])
// - BigInt64Array.from([1n,6n,10n])
// - BigInt64Array.from([2317294315139044277n,2480040720574581119n,7841528177112379523n])
// - ...

```

Available since 3.0.0.

## bigUint64Array​

---

Generate *BigUint64Array*

**Signatures:**

- `fc.bigUint64Array()`
- `fc.bigUint64Array({min?, max?, minLength?, maxLength?})`

**with:**

- `min?` --- default: `0n` --- *minimal value (included)*
- `max?` --- default: `36893488147419103231n` --- *maximal value (included)*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal length (included)*

**Usages:**

```
fc.bigUint64Array();
// Examples of generated values:
// - BigUint64Array.from([])
// - BigUint64Array.from([5117275114603473262n,4394569470798804304n,6920020017401806060n,5258603306780069742n,15799194364432350385n,15072217045501931685n,9890565973553172882n,1706618215611458822n])
// - BigUint64Array.from([8447847048858851281n])
// - BigUint64Array.from([3878267431246446816n,18446744073709551614n,17n])
// - BigUint64Array.from([18446744073709551606n,7n,11n,14792271127527525943n,17496620028939466016n,14087698165858284533n,1059307009916302871n])
// - ...
fc.bigUint64Array({max:42n,minLength:1});
// Examples of generated values:
// - BigUint64Array.from([5n,38n,18n,24n,14n,0n,31n,38n])
// - BigUint64Array.from([4n,1n,0n])
// - BigUint64Array.from([13n,1n,41n,1n,15n,0n])
// - BigUint64Array.from([1n])
// - BigUint64Array.from([7n,32n,23n,23n,10n,9n,24n,29n,11n,21n])
// - ...
```

# Combiners

# Any

Combine and enhance any existing arbitraries.

## option​

---

Randomly chooses between producing a value using the underlying arbitrary or returning nil

**Signatures:**

- `fc.option(arb)`
- `fc.option(arb, {freq?, nil?, depthSize?, maxDepth?, depthIdentifier?})`

**with:**

- `arb` --- *arbitrary that will be called to generate normal values*
- `freq?` --- default: `5` --- *probability to build the nil value is of 1 / freq*
- `nil?` --- default: `null` --- *nil value*
- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep? The chance to select the nil value will increase as we go deeper in the structure*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *when reaching maxDepth, only nil could be produced*
- `depthIdentifier?` --- default: `undefined` --- *share the depth between instances using the same `depthIdentifier`*

**Usages:**

```
fc.option(fc.nat());
// Examples of generated values: 28, 18, 2001121804, 2147483643, 12456933...
fc.option(fc.nat(),{freq:2});
// Examples of generated values: null, 1230277526, 10, 1854085942, 5...
fc.option(fc.nat(),{freq:2,nil:Number.NaN});
// Examples of generated values: Number.NaN, 292454282, 990664982, 703789134, 278848986...
fc.option(fc.string(),{nil:undefined});
// Examples of generated values: "p:s", "", "ot(RM", "|", "2MyPDrq6"...
// fc.option fits very well with recursive stuctures built using fc.letrec.
// Examples of such recursive structures are available with fc.letrec.

```

Available since 0.0.6.

## oneof​

---

Generate one value based on one of the passed arbitraries

Randomly chooses an arbitrary at each new generation. Should be provided with at least one arbitrary. Probability to select a specific arbitrary is based on its weight: `weight(instance) / sumOf(weights)` (for depth=0). For higher depths, the probability to select the first arbitrary will increase as we go deeper in the tree so the formula is not applicable as-is. It preserves the shrinking capabilities of the underlying arbitrary. `fc.oneof` is able to shrink inside the failing arbitrary but not across arbitraries (contrary to `fc.constantFrom` when dealing with constant arbitraries) except if called with `withCrossShrink`.

First arbitrary, a privileged one

The first arbitrary specified on `oneof` will have a privileged position. Constraints like `withCrossShrink` or `depthSize` tend to favor it over others.

**Signatures:**

- `fc.oneof(...arbitraries)`
- `fc.oneof({withCrossShrink?, maxDepth?, depthSize?, depthIdentifier?}, ...arbitraries)`

**with:**

- `...arbitraries` --- *arbitraries that could be used to generate a value. The received instances can either be raw instances of arbitraries (meaning weight is 1) or objects containing the arbitrary and its associated weight (integer value ≥0)*
- `withCrossShrink?` --- default: `false` --- *in case of failure the shrinker will try to check if a failure can be found by using the first specified arbitrary. It may be pretty useful for recursive structures as it can easily help reducing their depth in case of failure*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *when reaching maxDepth, the first arbitrary will be used to generate the value*
- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep? The chance to select the first specified arbitrary will increase as we go deeper in the structure*
- `depthIdentifier?` --- default: `undefined` --- *share the depth between instances using the same `depthIdentifier`*

**Usages:**

```
fc.oneof(fc.string(), fc.boolean());
// Note: Equivalent to:
//       fc.oneof(
//         { arbitrary: fc.string(), weight: 1 },
//         { arbitrary: fc.boolean(), weight: 1 },
//       )
// Examples of generated values: false, "x ", "\"AXf", "x%", true...
fc.oneof(fc.string(), fc.boolean(), fc.nat());
// Note: Equivalent to:
//       fc.oneof(
//         { arbitrary: fc.string(), weight: 1 },
//         { arbitrary: fc.boolean(), weight: 1 },
//         { arbitrary: fc.nat(), weight: 1 },
//       )
// Examples of generated values: "a:m[nG+", 2147483628, "le@o|g4", 1039477336, 1961824130...
fc.oneof({arbitrary: fc.string(),weight:5},{arbitrary: fc.boolean(),weight:2});
// Examples of generated values: "y", "u F(AR", true, ">,?4", false...
// fc.oneof fits very well with recursive stuctures built using fc.letrec.
// Examples of such recursive structures are available with fc.letrec.

```

## clone​

---

Multiple identical values (they might not equal in terms of `===` or `==`).

Generate tuple containing multiple instances of the same value - values are independent from each others.

**Signatures:**

- `fc.clone(arb, numValues)`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*
- `numValues` --- *number of clones (including itself)*

**Usages:**

```
fc.clone(fc.nat(),2);
// Examples of generated values: [1395148595,1395148595], [7,7], [1743838935,1743838935], [879259091,879259091], [2147483640,2147483640]...
fc.clone(fc.nat(),3);
// Examples of generated values:
// - [163289042,163289042,163289042]
// - [287842615,287842615,287842615]
// - [1845341787,1845341787,1845341787]
// - [1127181441,1127181441,1127181441]
// - [5,5,5]
// - ...

```

Available since 2.5.0.

## noBias​

---

Drop bias from an existing arbitrary. Instead of being more likely to generate certain values the resulting arbitrary will be close to an equi-probable generator.

**Signatures:**

- `fc.noBias(arb)`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*

**Usages:**

```
fc.noBias(fc.nat());
// Note: Compared to fc.nat() alone, the generated values are evenly distributed in
// the range 0 to 0x7fffffff making small values much more unlikely.
// Examples of generated values: 394798768, 980149687, 1298483622, 1164017931, 646759550...

```

Available since 3.20.0.

## noShrink​

---

Drop shrinking capabilities from an existing arbitrary.

Avoid dropping shrinking capabilities

Although dropping the shrinking capabilities can speed up your CI when failures occur, we do not recommend this approach. Instead, if you want to reduce the shrinking time for automated jobs or local runs, consider using `endOnFailure` or `interruptAfterTimeLimit`.

The only potentially legitimate use of dropping shrinking is when creating new complex arbitraries. In such cases, dropping useless parts of the shrinker may prove useful.

**Signatures:**

- `fc.noShrink(arb)`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*

**Usages:**

```
fc.noShrink(fc.nat());
// Examples of generated values: 1395148595, 7, 1743838935, 879259091, 2147483640...

```

Available since 3.20.0.

## limitShrink​

---

Limit shrinking capabilities of an existing arbitrary. Cap the number of potential shrunk values it could produce.

Avoid limiting shrinking capabilities

Although limiting the shrinking capabilities can speed up your CI when failures occur, we do not recommend this approach. Instead, if you want to reduce the shrinking time for automated jobs or local runs, consider using `endOnFailure` or `interruptAfterTimeLimit`.

The only potentially legitimate use of limiting shrinking is when creating new complex arbitraries. In such cases, limiting some less relevant parts may help preserve shrinking capabilities without requiring exhaustive coverage of the shrinker.

**Signatures:**

- `fc.limitShrink(arb, maxShrinks)`

**with:**

- `arb` --- *arbitrary instance responsible to generate values*
- `maxShrinks` --- *the maximal number of shrunk values that could be pulled from the arbitrary in case of shrink*

**Usages:**

```
fc.limitShrink(fc.nat(),3);
// Examples of generated values: 487640477, 1460784921, 1601237202, 1623804274, 5...

```

Available since 3.20.0.

## .filter​

---

Filter an existing arbitrary.

**Signatures:**

- `.filter(predicate)`

**with:**

- `predicate` --- *only keeps values such as `predicate(value) === true`*

**Usages:**

```
fc.integer().filter((n)=> n %2===0);
// Note: Only produce even integer values
// Examples of generated values: -1582642274, 2147483644, 30, -902884124, -20...
fc.integer().filter((n)=> n %2!==0);
// Note: Only produce odd integer values
// Examples of generated values: 925226031, -1112273465, 29, -1459401265, 21...
fc.string().filter((s)=> s[0]< s[1]);
// Note: Only produce strings with `s[0] < s[1]`
// Examples of generated values: "Aa]tp>", "apply", "?E%a$n x", "#l\"/L\"x&S{", "argument"...

```

## .map​

---

Map an existing arbitrary.

**Signatures:**

- `.map(mapper)`

**with:**

- `mapper` --- *transform the produced value into another one*

**Usages:**

```
fc.nat(1024).map((n)=> n * n);
// Note: Produce only square values
// Examples of generated values: 36, 24336, 49, 186624, 1038361...
fc.nat().map((n)=>String(n));
// Note: Change the type of the produced value from number to string
// Examples of generated values: "2147483619", "12", "468194571", "14", "5"...
fc.tuple(fc.integer(), fc.integer()).map((t)=>(t[0]< t[1]?[t[0], t[1]]:[t[1], t[0]]));
// Note: Generate a range [min, max]
// Examples of generated values: [-1915878961,27], [-1997369034,-1], [-1489572084,-370560927], [-2133384365,28], [-1695373349,657254252]...
fc.string().map((s)=>`[${s.length}] -> ${s}`);
// Examples of generated values: "[3] -> ref", "[8] -> xeE:81|z", "[9] -> B{1Z\\sxWa", "[3] -> key", "[1] -> _"...

```

## .chain​

---

Flat-Map an existing arbitrary.

Limited shrink

Be aware that the shrinker of such construct might not be able to shrink as much as possible (more details here)

**Signatures:**

- `.chain(fmapper)`

**with:**

- `fmapper` --- *produce an arbitrary based on a generated value*

**Usages:**

```
fc.nat().chain((min)=> fc.tuple(fc.constant(min), fc.integer({ min,max:0xffffffff})));
// Note: Produce a valid range
// Examples of generated values: [1211945858,4294967292], [1068058184,2981851306], [2147483626,2147483645], [1592081894,1592081914], [2147483623,2147483639]...

```

# Constant

Promote any set of constant values to arbitraries.

## constant​

---

Always produce the same value

**Signatures:**

- `fc.constant(value)`

**with:**

- `value` --- *value that will be produced by the arbitrary*

**Usages:**

```
fc.constant(1);
// Examples of generated values: 1...
fc.constant({});
// Examples of generated values: {}...

```

## constantFrom​

---

One of the values specified as argument.

Randomly chooses among the provided values. It considers the first value as the default value so that in case of failure it will shrink to it. It expects a minimum of one value and throws whether it receives no value as parameters. It can easily be used on arrays with `fc.constantFrom(...myArray)`.

**Signatures:**

- `fc.constantFrom(...values)`

**with:**

- `...values` --- *all the values that could possibly be generated by the arbitrary*

**Usages:**

```
fc.constantFrom(1,2,3);
// Examples of generated values: 1, 3, 2...
fc.constantFrom(1,'string',{});
// Examples of generated values: 1, "string", {}...

```

Available since 0.0.12.

## mapToConstant​

---

Map indexes to values.

Generate non-contiguous ranges of values by mapping integer values to constant.

**Signatures:**

- `fc.mapToConstant(...{ num, build })`

**with:**

- `...{ num, build }` --- *describe how to map integer values to their final values. For each entry, the entry defines `num` corresponding to the number of integer values it covers and `build`, a method that will produce a value given an integer in the range `0` (included) to `num - 1` (included)*

**Usages:**

```
fc.mapToConstant(
{num:26,build:(v)=>String.fromCharCode(v +0x61)},
{num:10,build:(v)=>String.fromCharCode(v +0x30)},
);
// Examples of generated values: "6", "8", "d", "9", "r"...

```

Available since 1.14.0.

## subarray​

---

Generate values corresponding to any possible sub-array of an original array.

Values of the resulting subarray are ordered the same way they were in the original array.

**Signatures:**

- `fc.subarray(originalArray)`
- `fc.subarray(originalArray, {minLength?, maxLength?})`

**with:**

- `originalArray` --- *the array from which we want to extract sub-arrays*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `originalArray.length` --- *maximal length (included)*

**Usages:**

```
fc.subarray([1,42,48,69,75,92]);
// Examples of generated values: [], [1,48,69,75,92], [48], [1,42,75], [1,48,75,92]...
fc.subarray([1,42,48,69,75,92],{minLength:5});
// Examples of generated values: [1,42,48,69,75], [1,42,48,69,92], [1,42,48,75,92], [42,48,69,75,92], [1,42,69,75,92]...
fc.subarray([1,42,48,69,75,92],{maxLength:5});
// Examples of generated values: [48,75], [1], [], [48,92], [69,75]...
fc.subarray([1,42,48,69,75,92],{minLength:2,maxLength:3});
// Examples of generated values: [48,75], [48,69,92], [42,75], [69,92], [1,42]...

```

Available since 1.5.0.

## shuffledSubarray​

---

Generate values corresponding to any possible sub-array of an original array.

Values of the resulting subarray are ordered randomly.

**Signatures:**

- `fc.shuffledSubarray(originalArray)`
- `fc.shuffledSubarray(originalArray, {minLength?, maxLength?})`

**with:**

- `originalArray` --- *the array from which we want to extract sub-arrays*
- `minLength?` --- default: `0` --- *minimal length (included)*
- `maxLength?` --- default: `originalArray.length` --- *maximal length (included)*

**Usages:**

```
fc.shuffledSubarray([1,42,48,69,75,92]);
// Examples of generated values: [69,92], [92,69,42,75], [48,69,92,75,42,1], [1,42], [75]...
fc.shuffledSubarray([1,42,48,69,75,92],{minLength:5});
// Examples of generated values: [48,1,92,69,75,42], [42,1,92,75,69], [69,75,92,48,1], [92,42,48,75,69], [1,69,75,92,42]...
fc.shuffledSubarray([1,42,48,69,75,92],{maxLength:5});
// Examples of generated values: [48,1,92], [], [75,1,69,92], [42], [75,1,69,48,42]...
fc.shuffledSubarray([1,42,48,69,75,92],{minLength:2,maxLength:3});
// Examples of generated values: [1,92], [92,75], [1,48], [42,75], [48,69]...
```

# Recursive Structure

Define arbitraries able to generate recursive structures.

## letrec​

---

Generate recursive structures.

Prefer `fc.letrec` over `fc.memo`. Most of the features offered by `fc.memo` can now be implemented with `fc.letrec`.

**Signatures:**

- `fc.letrec(builder)`

**with:**

- `builder` --- *builder function defining how to build the recursive structure, it answers to the signature `(tie) =>`object with key corresponding to the name of the arbitrary and with vaue the arbitrary itself. The `tie` function given to builder should be used as a placeholder to handle the recursion. It takes as input the name of the arbitrary to use in the recursion.*

**Usages:**

```
// Setup the tree structure:
const{ tree }= fc.letrec((tie)=>({
// Warning: In version 2.x and before, there is no automatic control over the depth of the generated data-structures.
// As a consequence to avoid your data-structures to be too deep, it is highly recommended to add the constraint `depthFactor`
// onto your usages of `option` and `oneof` and to put the arbitrary without recursion first.
// In version 3.x, `depthSize` (previously `depthFactor`) and `withCrossShrink` will be enabled by default.
tree: fc.oneof({depthSize:'small',withCrossShrink:true},tie('leaf'),tie('node')),
node: fc.record({
left:tie('tree'),
right:tie('tree'),
}),
leaf: fc.nat(),
}));
// Use the arbitrary:
tree;
// Examples of generated values:
// - 1948660480
// - {"left":2147483625,"right":28}
// - {__proto__:null,"left":{__proto__:null,"left":21,"right":2147483628},"right":2147483619}
// - 423794071
// - 27
// - ...
fc.letrec((tie)=>({
node: fc.record({
value: fc.nat(),
left: fc.option(tie('node'),{maxDepth:1,depthIdentifier:'tree'}),
right: fc.option(tie('node'),{maxDepth:1,depthIdentifier:'tree'}),
}),
})).node;
// Note: You can limit the depth of the generated structrures by using the constraint `maxDepth` (see `option` and `oneof`).
//   On the example above we need to specify `depthIdentifier` to share the depth between left and right branches...
// Examples of generated values:
// - {__proto__:null,"value":2147483632,"left":{__proto__:null,"value":1485877161,"left":null,"right":null},"right":{__proto__:null,"value":685791529,"left":null,"right":null}}
// - {__proto__:null,"value":1056088736,"left":null,"right":{__proto__:null,"value":2147483623,"left":null,"right":null}}
// - {"value":1227733267,"left":{"value":21,"left":null,"right":null},"right":{"value":2147483644,"left":null,"right":null}}
// - {"value":17,"left":null,"right":{"value":12,"left":null,"right":null}}
// - {"value":17,"left":{__proto__:null,"value":12,"left":null,"right":null},"right":{__proto__:null,"value":591157184,"left":null,"right":null}}
// - ...
// Setup the depth identifier shared across all nodes:
const depthIdentifier = fc.createDepthIdentifier();
// Use the arbitrary:
fc.letrec((tie)=>({
node: fc.record({
value: fc.nat(),
left: fc.option(tie('node'),{maxDepth:1, depthIdentifier }),
right: fc.option(tie('node'),{maxDepth:1, depthIdentifier }),
}),
})).node;
// Note: Calling `createDepthIdentifier` is another way to pass a value for `depthIdentifier`. Compared to the string-based
// version, demo-ed in the snippet above, it has the benefit to never collide with other identifiers manually specified.
// Examples of generated values:
// - {__proto__:null,"value":2147483645,"left":{"value":9,"left":null,"right":null},"right":null}
// - {__proto__:null,"value":7,"left":null,"right":{__proto__:null,"value":96999551,"left":null,"right":null}}
// - {"value":3,"left":{__proto__:null,"value":1312350013,"left":null,"right":null},"right":null}
// - {"value":2051975271,"left":{"value":2147483645,"left":null,"right":null},"right":{"value":1305755095,"left":null,"right":null}}
// - {"value":2,"left":{"value":1530374940,"left":null,"right":null},"right":null}
// - ...
fc.letrec((tie)=>({
node: fc.record({
value: fc.nat(),
left: fc.option(tie('node'),{maxDepth:1}),
right: fc.option(tie('node'),{maxDepth:1}),
}),
})).node;
// ...If we don't specify it, the maximal number of right in a given path will be limited to 1, but may include intermediate left.
//    Thus the resulting trees might be deeper than 1.
// Examples of generated values:
// - {__proto__:null,"value":14,"left":{__proto__:null,"value":1703987241,"left":null,"right":{"value":643118365,"left":null,"right":null}},"right":{__proto__:null,"value":1029204262,"left":{__proto__:null,"value":1968117159,"left":null,"right":null},"right":null}}
// - {__proto__:null,"value":26,"left":{__proto__:null,"value":1662273887,"left":null,"right":{__proto__:null,"value":525337883,"left":null,"right":null}},"right":{__proto__:null,"value":797448699,"left":{"value":657617990,"left":null,"right":null},"right":null}}
// - {__proto__:null,"value":2121842454,"left":null,"right":{"value":1835255719,"left":{__proto__:null,"value":1989636808,"left":null,"right":null},"right":null}}
// - {"value":1438784023,"left":{__proto__:null,"value":24,"left":null,"right":{__proto__:null,"value":420442369,"left":null,"right":null}},"right":{"value":9,"left":{__proto__:null,"value":1424795296,"left":null,"right":null},"right":null}}
// - {__proto__:null,"value":1331332801,"left":null,"right":{__proto__:null,"value":1001840875,"left":{__proto__:null,"value":1327656949,"left":null,"right":null},"right":null}}
// - ...
fc.letrec((tie)=>({
tree: fc.oneof({maxDepth:2},{arbitrary:tie('leaf'),weight:0},{arbitrary:tie('node'),weight:1}),
node: fc.record({left:tie('tree'),right:tie('tree')}),
leaf: fc.nat(),
})).tree;
// Note: Exact depth of 2: not more not less.
// Note: If you use multiple `option` or `oneof` to define such recursive structure
//   you may want to specify a `depthIdentifier` so that they share the exact same depth.
//   See examples above for more details.
// Examples of generated values:
// - {__proto__:null,"left":{"left":1313545969,"right":13},"right":{"left":9,"right":27}}
// - {"left":{__proto__:null,"left":17,"right":5},"right":{__proto__:null,"left":874941432,"right":25}}
// - {"left":{"left":18,"right":1121202},"right":{"left":831642574,"right":1975057275}}
// - {__proto__:null,"left":{__proto__:null,"left":1542103881,"right":9},"right":{__proto__:null,"left":1645153719,"right":21}}
// - {"left":{__proto__:null,"left":749002681,"right":2069272340},"right":{__proto__:null,"left":16,"right":16}}
// - ...
fc.statistics(
  fc.letrec((tie)=>({
node: fc.record({
value: fc.nat(),
left: fc.option(tie('node')),
right: fc.option(tie('node')),
}),
})).node,
(v)=>{
functionsize(n){
if(n ===null)return0;
elsereturn1+size(n.left)+size(n.right);
}
const s =size(v);
let lower =1;
constnext=(n)=>(String(n)[0]==='1'? n *5: n *2);
while(next(lower)<= s){
      lower =next(lower);
}
return`${lower} to ${next(lower)-1} items`;
},
);
// Computed statistics for 10k generated values:
// For size = "xsmall":
// - 5 to 9 items....42.99%
// - 10 to 49 items..39.82%
// - 1 to 4 items....17.19%
// For size = "small":
// - 10 to 49 items..85.95%
// - 5 to 9 items.....5.35%
// - 1 to 4 items.....4.35%
// - 50 to 99 items...4.35%
// For size = "medium":
// - 100 to 499 items..83.03%
// - 50 to 99 items....10.05%
// - 1 to 4 items.......3.78%
// - 10 to 49 items.....2.93%
// - 5 to 9 items.......0.14%
fc.statistics(
  fc.letrec((tie)=>({
node: fc.record({
value: fc.nat(),
children: fc.oneof(
{depthIdentifier:'node'},
        fc.constant([]),
        fc.array(tie('node'),{depthIdentifier:'node'}),
),
}),
})).node,
(v)=>{
functionsize(n){
if(n ===null)return0;
elsereturn1+ n.children.reduce((acc, child)=> acc +size(child),0);
}
const s =size(v);
let lower =1;
constnext=(n)=>(String(n)[0]==='1'? n *5: n *2);
while(next(lower)<= s){
      lower =next(lower);
}
return`${lower} to ${next(lower)-1} items`;
},
);
// Computed statistics for 10k generated values:
// For size = "xsmall":
// - 1 to 4 items..100.00%
// For size = "small":
// - 1 to 4 items....60.16%
// - 10 to 49 items..23.99%
// - 5 to 9 items....15.83%
// - 50 to 99 items...0.02%
// For size = "medium":
// - 1 to 4 items......51.31%
// - 50 to 99 items....26.41%
// - 10 to 49 items....16.16%
// - 100 to 499 items...5.93%
// - 5 to 9 items.......0.14%

```

Available since 1.16.0.

## memo​

---

Generate recursive structures.

Prefer `fc.letrec` when feasible

Initially `fc.memo` has been designed to offer a higher control over the generated depth. Unfortunately it came with a cost: the arbitrary itself is costly to build. Most of the features offered by `fc.memo` can now be done using `fc.letrec` coupled with `fc.option` or `fc.oneof`. Whenever possible, we recommend using `fc.letrec` instead of `fc.memo`.

**Signatures:**

- `fc.memo(builder)`

**with:**

- `builder` --- *builder function defining how to build the recursive structure. It receives as input the remaining depth and has to return an arbitrary (potentially another `memo` or itself)*

**Usages:**

```
// Setup the tree structure:
const tree = fc.memo((n)=> fc.oneof(leaf(),node(n)));
const node = fc.memo((n)=>{
if(n <=1)return fc.record({left:leaf(),right:leaf()});
return fc.record({left:tree(),right:tree()});// tree() is equivalent to tree(n-1)
});
const leaf = fc.nat;
// Use the arbitrary:
tree(2);
// Note: Only produce trees having a maximal depth of 2
// Examples of generated values:
// - 24
// - {"left":{__proto__:null,"left":1696460155,"right":2147483646},"right":135938859}
// - 9
// - {"left":27,"right":{"left":2147483633,"right":2147483631}}
// - {"left":29,"right":{"left":2,"right":367441398}}
// - ...
```

# String

Combine and enhance existing string arbitraries.

## stringMatching​

---

String matching the passed regex.

**Signatures:**

- `fc.stringMatching(regex)`
- `fc.stringMatching(regex, {size?})`

**with:**

- `regex` --- *the regex to be matched by produced strings*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.stringMatching(/\s(html|php|css|java(script)?)\s/);
// Note: The regex does not contain ^ or $ assertions, so extra text could be added before and after the match
// Examples of generated values: "ca\rjava 4&", "K7c<:(\"T\"a\njavascript &IsEnetter", "NXlk\tjava\fto", "e\u000bjavascript\fname", "> java\t2zy:}g"...
fc.stringMatching(/^rgb\((?:\d|[1-9]\d|1\d\d|2[0-5]\d),(?:\d|[1-9]\d|1\d\d|2[0-5]\d),(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\)$/);
// Note: Regex matching RGB colors
// Examples of generated values: "rgb(237,6,11)", "rgb(143,160,247)", "rgb(257,213,251)", "rgb(4,185,33)", "rgb(253,230,211)"...
fc.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[12345][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
// Note: Regex matching UUID
// Examples of generated values:
// - "fd606aa1-b53b-1c7b-9e2f-1e2c1ff1b8e9"
// - "e74cec0b-bd5a-4dba-96a9-edbfa9c1a198"
// - "fcccdcf3-908e-5179-adce-7ebae72c12dc"
// - "0eab1fab-5bc2-336c-9ccb-a3fecbe72ee2"
// - "bb3073ee-2283-2538-ba0c-1b976ebb9610"
// - ...
fc.stringMatching(
/^(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)$/,
);
// Note: Regex matching IP v4, we rather recommend you to rely on `fc.ipV4()`
// Examples of generated values: "226.4.220.240", "206.2.148.227", "247.32.128.41", "165.252.212.135", "18.225.51.96"...

```

Available since 3.10.0.

## mixedCase​

---

Switch the case of characters generated by an underlying arbitrary.

**Signatures:**

- `fc.mixedCase(stringArb)`
- `fc.mixedCase(stringArb, { toggleCase?, untoggleAll? })`

**with:**

- `stringArb` --- *arbitrary producing random strings*
- `toggleCase?` --- default: *try `toUpperCase` on the received code-point, if no effect try `toLowerCase`* --- *custom toggle case function that will be called on some of the code-points to toggle the character*
- `untoggleAll?` --- default: `undefined` --- *transform a string containing possibly toggled items to its untoggled version, when provided it makes it possible to shrink user-definable values, otherwise user-definable values will not be shrinkable BUT values generated by the framework will be shrinkable*

**Usages:**

```
fc.mixedCase(fc.array(fc.constantFrom('a','b','c')).map((cs)=> cs.join('')));
// Examples of generated values: "cAcCcCCC", "", "CBCbCAbA", "AAcaABab", "Cc"...
fc.mixedCase(fc.constant('hello world'));
// Examples of generated values: "HEllO wOrLd", "hElLo WoRLD", "hELlo woRlD", "helLO WOrLd", "HEllo wOrld"...
fc.mixedCase(fc.constant('hello world'),{
toggleCase:(rawChar)=>`UP(${rawChar})`,
// untoggleAll is optional, we use it in this example to show how to use all the options together
untoggleAll:(toggledString)=> toggleString.replace(/UP\((.)\)/g,'$1'),
});
// Examples of generated values:
// - "UP(h)elUP(l)o UP(w)UP(o)rUP(l)UP(d)"
// - "UP(h)eUP(l)UP(l)UP(o) UP(w)oUP(r)UP(l)UP(d)"
// - "UP(h)UP(e)lUP(l)UP(o)UP( )UP(w)UP(o)UP(r)ld"
// - "UP(h)elUP(l)oUP( )UP(w)orUP(l)UP(d)"
// - "helUP(l)o UP(w)orlUP(d)"
// - ...
fc.mixedCase(fc.constant('🐱🐢🐱🐢🐱🐢'),{
toggleCase:(rawChar)=>(rawChar ==='🐱'?'🐯':'🐇'),
});
// Examples of generated values: "🐯🐇🐱🐢🐯🐢", "🐱🐇🐱🐇🐯🐇", "🐱🐢🐯🐢🐱🐢", "🐱🐢🐱🐇🐯🐢", "🐱🐢🐯🐢🐱🐇"...

```

# Fake Data

# File

Generate file content values.

## base64String​

---

Base64 string containing characters produced by `fc.base64()`.

Provide valid base64 strings: length always multiple of 4 padded with '=' characters.

**Signatures:**

- `fc.base64String()`
- `fc.base64String({minLength?, maxLength?, size?})`

**with:**

- `minLength?` --- default: `0` --- *minimal number of characters (included)*
- `maxLength?` --- default: `0x7fffffff` more --- *maximal number of characters (included if multiple of 4)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

_When using `minLength` and `maxLength` make sure that they are compatible together. For instance: asking for `minLength=2` and `maxLength=3` is impossible for base64 strings as produced by the framework_

**Usages:**

```
fc.base64String();
// Examples of generated values: "", "J7B8AB/V89==", "3H9Pr5M=", "bv6z", "V/GSu73r"...
fc.base64String({maxLength:8});
// Note: Any base64 string containing up to 8 (included) characters
// Examples of generated values: "f3A+nr==", "37/7", "", "wC9q", "BLop9YK="...
fc.base64String({minLength:8});
// Note: Any base64 string containing at least 8 (included) characters
// Examples of generated values: "f3A+nrd9UefIFrD27/==", "7/7+S88//DE/6M9QPAFg", "9refalueODsnam==", "toString", "callerkeyC8="...
fc.base64String({minLength:4,maxLength:12});
// Note: Any base64 string containing between 4 (included) and 12 (included) characters
// Examples of generated values: "YQ7D/IU8fE+2", "tjhMHtq9", "property", "9lm8Vx7bBF==", "roto"...

```

## json​

---

JSON compatible string representations of instances. Can produce string representations of basic primitives but also of deep objects.

The generated values can be parsed by `JSON.parse`. All the string values (from keys to values) are generated using `fc.string()`.

**Signatures:**

- `fc.json()`
- `fc.json({depthSize?, maxDepth?, noUnicodeString?, stringUnit?})`

**with:**

- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep?*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *maximal depth of generated objects*
- `noUnicodeString?` --- default: `true` --- *toggle on/off the generation of strings used either as keys or values of the instance and including non-ascii characters --- shadowed by `stringUnit`*
- `stringUnit?` --- default: `undefined` --- *customize the set of characters being used by the `string` arbitrary*

**Usages:**

```
fc.json();
// Examples of generated values:
// - "[\"oU6LT>'\",{\"QZ#YUZNw\":null,\"#\":null,\")>*\":{\"q&B1cUDn=\":\"CZTPpisxH\",\"u`)})\":\"_a-\",\"\":null},\"dY~Dn>k\":true,\"=nC#&uS5l%\":\"0\\\"j-o,JV\",\"TX[OKj\":-1.7084671585468263e+151,\"\\\"\":true,\"@(:<LUW\":\"s-JYYB\"},[]]"
// - "\"al[->g\""
// - "null"
// - "-5e-323"
// - "[null,-1.5485504457576672e+192,null,{},-1.417727947024272e-287,null,null,null]"
// - ...
fc.json({noUnicodeString:false});
// Examples of generated values:
// - "{}"
// - "[{\"󜁳򁿳򎗯􈤘񖇅\":null,\"򈷩𫨹􏥃򤵪񥉨񢦜꣙\":[null,\"򉲨򛨰𜥲񆠉򁀿񇆾􀤯񾱄\"],\"__def\":\"񥛡\",\"𴂏򰷳𩪎񡨫\":true,\"\\u0012􏿺\":\"\",\"􍥚󛂾𓴒\":false},[3.5931489320423776e+139,[true,\"󌘅񪜆󗛃󎩻𙹖򞠚򺳵񨶖\",false,{\"􊆪򓔝򘥬𔧥󴓌򩁆\":null,\"\":\"󌽡𗀥󚨿󊭹򎻎񀓜򧅘򏜣󨓚񯄈\",\"𽸧򽂵񯆎񷡰𑴵񞱒\":[true,\"򀲑򿒦\",true,\"􊔹񒚡𣉟𳡸񮋳󳝶\",false,-4.119935921393037e+259,null,-8.9364525362984475e+248]},\"򸀿󳿴񥘡򪠾򃰧򣖏\",\"󱝇򹢖𬂏񠤫󴕠򒐧\"]],[false,-6.0502670401327095e+112,1.1096547717393745e-177,null,null,null,false,[null,\"󘳑㨦𭦄񱹂𚃜򅅪󪃗򟓓󊕝򠗺\",1.288654068889961e-213,null,1.6406299790913147e-206]]]"
// - "\"򁤇𫍯􏿬\\u0004񞋰\\u0005򟱉򳟔󽐾\""
// - "[null,[{\"壏\":true,\"𮀳񠍞󗈌\":\"耕򰶤䰅𸬣\",\"\":null,\"𘥣񯙝𖹟󗨟𯵽򿈤􊇦󣌙󸫨󸅔\":true,\"󒾠򈄕󬀘𚨶󍋤񃞜𮢌􇶸񏭘\":null,\"񮹷񀚤󷅓󰪼􀆌𥰂𫃩𧆔𹷹󭼜\":true,\"󛶋򣄚񼇏򡭇󹃤󢁬𞲢\":-4.059178361848322e-91,\"򉁀򠾫𓦞𑬞󵫽򏥷񹺏􌗈\":true},null],[3.6448982683876056e+131]]"
// - "[null,false]"
// - ...
fc.json({maxDepth:0});
// Examples of generated values: "null", "\"T\"", "-1.6050118268310372e-215", "true", "\"Ep\""...
fc.json({maxDepth:1});
// Examples of generated values: "{\"V~<\\\"#}\":\"apply\"}", "{\"DZ&2@~yE\":4.016561322014934e-232}", "null", "true", "{}"...
fc.json({depthSize:'medium'});
// Examples of generated values:
// - "4.4e-323"
// - "[\"v!56\",true,{\"n.Z-KP\":\"WeB\",\"%sT\":true,\"+vJj71IB1\":\"p\\\"9|V\\\".\",\"B~U)!j6>:0\":\"?]2R)hy\",\"<C\":5.763682596504741e-124,\"g\":5.506486779037679e+86,\"^\":false,\"0beh\":null},null,true,false,null]"
// - "5e-323"
// - "{\"valueOf\":{\"hCu2[\":{\"}t\":{\"rC,RK\":false,\"|sD.+@+\":\"K?e5tLzu\"},\"*4 80r\":{\"=c8x 3^\":\"\",\"bv2;Pdc\":266593828340.0835,\"&F{b*Ow:tH\":3.854574422896131e-236,\"\":-3.136445144286352e-152,\"7 a[$t.f[\":null,\"S\":true,\"VdF\":\"zr}U[\"},\"suNX+*`0y\":null,\"GO*sBjC8G1\":{\"Bx5_>&C'l\":\"<\",\"8qI\":1.5292990047864634e-116,\"hKPYD5\":-1.7059350714655333e+80,\";-{\":false,\"-0/PeWhX)3\":\"-}|\",\"\":null,\"!\":\"H0(|XlzFMY\",\"peo`:V\":\"%#BLcJMT\",\"T+FOe$\":true,\"Z7\":null},\"zCA'ft\\\\l^J\":[null]}},\";oU_&9\":{\"b\":{\"\":null,\"%C\":\"+Lf\",\"%6>\":1.7976931348623147e+308,\"}vi!#D[G\\\\\":null,\"g.q&2evf\":\"C^tirM8d?,\",\"4t4aCG\":true,\"$n\\\"\":\"(IbE\"},\"|Bt[MInNOk\":null,\"#&$gzzy\":null,\"bd7cNTL\":[null,\"D\",null,1.627654078166552e+223,null,null,\"g\",\"gr\",-1.137436331927833e+42,-3.0030877534684717e+142],\" j]\":{\"hlI1\":null,\"e1$j@B\":null,\"-!\":\"7<!94\",\"fM@\":-4.396133099620614e-146,\"RwN]?%U@b7\":null,\"KB\":true,\"k=z<\":1.8766725492972305e-96,\"\":null,\"~b1>42%\":null,\"G\":null},\":v FiA\":\"k\",\"VlI okG\":0,\"f\":null,\"%w*B}\":true,\"\":\"apply\"},\"l\":[7.6086682491958856e-146,{\"5\":\"\",\"Y)s.a\":null,\"0y]0ca@qm2\":\"inPS~K2q{\",\"S*Z*f&=\":null,\"-=u\":false,\"v.P\":-7.067638177674602e+76},\"$~1<?Pv_\",null,[2.219624217009348e-22,-9.770861754123764e+110,true,null,\"/.1Q%v\",null,null],true,1.2718114310572915e+272,true,true]}"
// - "{\"L|hZ\":{\"~(\":\"4jKldvae;X\",\"NU(b\":null,\"\":4.163017031290256e+162,\"K\\\"F\":null,\"o<|c\":true,\"< bZ] \":false,\"wS,Riq}CV4\":-5.298684866824531e+64},\"3md/a<_r{\\\"\":{},\"-Rcc`3_\":[true,\"xuY=Hd6 \",{\"5e(_%d9^0d\":null,\"^q#$iu\":null},1.973826918030355e-291,{\"k\":-2.1122181366513202e+135,\"fYxj@\":-1.351657689147719e-183,\"2<+2nm%\":6.329905233731848e-285,\"4y.!XKqc\":null,\"CSaX}b\":\"`J_fU\",\"nc\":null,\"OXR>\":\"^xW!\"}],\"\":{\"d1}%eQ=\":{\":\":false,\"bO9,.DM\":false}},\"4iK-j!9hx\":{\"xK^[~mT\":null,\"l2$7G5(\":{\"4%' 15&pK\":true,\"[$@Y`\":\"5EHH_d.@|\",\"\":\"\\\\\",\"E~[./|O3\":-9.129273010709225e+288},\"K\\\\;/4elg|$\":null,\"jr\":-1.0758585287978389e-274,\"~@S\":\"\",\",*I)0\":\"]7\",\"-!:NF\":true,\"(Dp\":\")3Fd\",\"(:^0XUcye2\":null}}"
// - ...

```

Available since 0.0.7.

## jsonValue​

---

Generate any value eligible to be stringified in JSON and parsed back to itself - *in other words, JSON compatible instances*.

As `JSON.parse` preserves `-0`, `jsonValue` can also have `-0` as a value. `jsonValue` must be seen as: any value that could have been built by doing a `JSON.parse` on a given string.

Note

`JSON.parse(JSON.stringify(value))` is not the identity as `-0` is changed into `0` by `JSON.stringify`.

**Signatures:**

- `fc.jsonValue()`
- `fc.jsonValue({depthSize?, maxDepth?, noUnicodeString?, stringUnit?})`

**with:**

- `depthSize?` --- default: `undefined` more --- *how much we allow our recursive structures to be deep?*
- `maxDepth?` --- default: `Number.POSITIVE_INFINITY` --- *maximal depth for generated objects (Map and Set included into objects)*
- `noUnicodeString?` --- default: `true` --- *toggle on/off the generation of strings used either as keys or values of the instance and including non-ascii characters --- shadowed by `stringUnit`*
- `stringUnit?` --- default: `undefined` --- *customize the set of characters being used by the `string` arbitrary*

**Usages:**

```
fc.jsonValue();
// Examples of generated values:
// - true
// - {"a":false,"&{v%":true,"O}u&;O":"ef","^69fY8G[M":false,"^%":null,"iC":-2.11992523062418e-82,"F%]8l0g6|":null}
// - [{"^":true,"1Y??Vih":-379313284684773500000,"_5zzvjCE":"B","B561n_":"2","eqHZM9R":null},1.2791945048214157e-72]
// - false
// - [null,true,true,"`l+$I","kSros",null]
// - ...
fc.jsonValue({noUnicodeString:false});
// Examples of generated values:
// - ["򴾼󹤷𡅤񤱓򛗡"]
// - {"􎵔򲁼򀎈𸝔􃌅􊿛񹙦":[false],"򨊗𤮈𡈡󵑑񗀏򏗔𙔔𐸵񇘼":556603.8398649627,"􏿽\u000b򸑽":{"񐀞󴕃󙉅񂊠𴛐󻕀㢋񦔘":true,"񊈒􋚭󷪙𫪀󌧶񉝒𱣆":null,"":5.539268054957889e+74,"򦹷":"񜝍⌳򻍜񇓷񖋦","񥸱񥊔򦹗":4.847354156832373e-25,"񜂑򹏁󞦐":"𻬫𳤲󵹃򕏧񁃵","𓧎𖰦":false,"󛻳򏜚񃛷񌛑𝜀󞅤񪉺":false}}
// - [null,["󿦼񌅡󯻾𝀹򲓋񁆺񐿏󃢰",-2.4628931920258706e-282,null,false,2.681696006505804e-238,"򢰮"]]
// - "򐐩"
// - []
// - ...
fc.jsonValue({maxDepth:0});
// Examples of generated values: true, null, false, "prototype", "L4)5M"...
fc.jsonValue({maxDepth:1});
// Examples of generated values:
// - 1.1084525170506737e-156
// - [null,"co",null]
// - [null,null]
// - [null,"_",-4.808983581881553e-305,1.3122779113832298e-87,"<tiQ8",null]
// - true
// - ...
fc.statistics(fc.jsonValue(),(v)=>{
functionsize(n){
if(Array.isArray(n))return1+ n.reduce((acc, child)=> acc +size(child),0);
if(typeof n ==='object'&& n)return1+Object.values(n).reduce((acc, child)=> acc +size(child),0);
return1;
}
const s =size(v);
let lower =1;
constnext=(n)=>(String(n)[0]==='1'? n *5: n *2);
while(next(lower)<= s){
    lower =next(lower);
}
return`${lower} to ${next(lower)-1} items`;
});
// Computed statistics for 10k generated values:
// For size = "xsmall":
// - 1 to 4 items..100.00%
// For size = "small":
// - 1 to 4 items....43.79%
// - 10 to 49 items..38.40%
// - 5 to 9 items....17.64%
// - 50 to 99 items...0.17%
// For size = "medium":
// - 50 to 99 items......35.09%
// - 1 to 4 items........33.88%
// - 10 to 49 items......20.48%
// - 100 to 499 items....10.15%
// - 500 to 999 items.....0.36%
fc.statistics(fc.jsonValue({maxDepth:2}),(v)=>{
functionsize(n){
if(Array.isArray(n))return1+ n.reduce((acc, child)=> acc +size(child),0);
if(typeof n ==='object'&& n)return1+Object.values(n).reduce((acc, child)=> acc +size(child),0);
return1;
}
const s =size(v);
let lower =1;
constnext=(n)=>(String(n)[0]==='1'? n *5: n *2);
while(next(lower)<= s){
    lower =next(lower);
}
return`${lower} to ${next(lower)-1} items`;
});
// Computed statistics for 10k generated values:
// For size = "xsmall":
// - 1 to 4 items..100.00%
// For size = "small":
// - 1 to 4 items....44.64%
// - 5 to 9 items....34.00%
// - 10 to 49 items..21.36%
// For size = "medium":
// - 1 to 4 items......34.60%
// - 50 to 99 items....33.01%
// - 10 to 49 items....26.56%
// - 100 to 499 items...4.49%
// - 5 to 9 items.......1.34%

```

Available since 2.20.0.

## lorem​

---

Lorem ipsum values.

**Signatures:**

- `fc.lorem()`
- `fc.lorem({maxCount?, mode?, size?})`

**with:**

- `maxCount?` --- default: `0x7fffffff` more --- if `mode` is `"words"`: lorem ipsum sentence containing at most `maxCount` sentences, otherwise: containing at most `maxCount` words\_
- `mode?` --- default: `"words"` --- *enable sentence mode by setting its value to `"sentences"`*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.lorem();
// Examples of generated values:
// - "magna ullamcorper iaculis purus nec"
// - "lorem"
// - "eu semper lectus mauris sed in nulla non scelerisque massa enim cras"
// - "mauris arcu cras molestie"
// - "euismod"
// - ...
fc.lorem({maxCount:3});
// Examples of generated values: "duis enim nonummy", "consequat pharetra iaculis", "sollicitudin mi curabitur", "faucibus", "cursus sit ac"...
fc.lorem({maxCount:3,mode:'sentences'});
// Examples of generated values:
// - "Nec, dolor congue vitae pellentesque orci amet."
// - "Amet augue metus nibh rhoncus nulla morbi dui sed ac. Aliquam massa, et vestibulum integer suscipit magna pellentesque nonummy. Mi tellus, posuere vestibulum nibh."
// - "Ullamcorper orci ipsum diam ultrices convallis mollis, ullamcorper. Vitae faucibus bibendum ligula."
// - "Elementum semper iaculis ligula mauris ipsum mauris. Cursus massa nulla semper feugiat, sed scelerisque."
// - "Vitae. Dolor primis aenean convallis adipiscing mauris in odio ante. Massa, faucibus."
// - ...
```

# Identifier

Generate identifier values.

## ulid​

ULID values.

**Signatures:**

- `fc.ulid()`

**Usages:**

```
fc.ulid();
// Examples of generated values:
// - "7AVDFZJAXCM0F25E3SZZZZZZYZ"
// - "7ZZZZZZZYP5XN60H51ZZZZZZZP"
// - "2VXXEMQ2HWRSNWMP9PZZZZZZZA"
// - "15RQ23H1M8YB80EVPD2EG8W7K1"
// - "6QV4RKC7C8ZZZZZZZFSF7PWQF5"
// - ...

```

Available since 3.11.0.

## uuid​

UUID values including versions 1 to 5 and going up to 15 when asked to.

**Signatures:**

- `fc.uuid()`
- `fc.uuid({version?})`

**with:**

- `version` --- default: `[1,2,3,4,5,6,7,8]` --- *version or versions of the uuid to produce: 1, 2, 3, 4, 5... or 15. By default, we only produce UUIDs with versions being officially assigned, ie. from 1 to 8*

**Usages:**

```
fc.uuid();
// Examples of generated values:
// - "4ebb3995-0009-1000-8b20-2254b7902e27"
// - "ffffffef-50fb-40b5-aa9f-05640000001d"
// - "87a8e397-ffec-8fff-8000-001a00000004"
// - "17983d5d-001b-1000-98d3-6afba08e1e61"
// - "7da15579-001d-1000-a6b3-4d71cf6e5de5"
// - ...
fc.uuid({version:4});
// Examples of generated values:
// - "00000009-2401-464f-bd6c-b85100000018"
// - "ffffffea-ffe7-4fff-af56-be4ec6ccfa3c"
// - "00000013-6705-4bdd-bfe3-0669d6ee4e9a"
// - "ed7479b3-cef8-4562-bc9c-0b0d8b2be3ae"
// - "58dbd17a-7152-4770-8d89-9485fffffff6"
// - ...
fc.uuid({version:[4,7]});
// Examples of generated values:
// - "ffffffe8-4e61-40c1-8000-001d7f621812"
// - "0000001f-b6dc-7d7d-b40c-08568ae90153"
// - "0000000b-0002-4000-9003-de96d8957794"
// - "8b8e8b89-251e-78e7-8000-000000000000"
// - "ffffffe5-000d-4000-bfff-fff496517cc4"
// - ...
```

# Internet

Generate internet related values.

## ipV4​

IP v4 addresses.

**Signatures:**

- `fc.ipV4()`

**Usages:**

```
fc.ipV4();
// Examples of generated values: "149.2.84.39", "255.251.100.5", "151.253.2.4", "93.3.251.97", "121.3.113.229"...

```

Available since 1.14.0.

## ipV4Extended​

IP v4 addresses including all the formats supported by WhatWG standard (for instance: 0x6f.9).

**Signatures:**

- `fc.ipV4Extended()`

**Usages:**

```
fc.ipV4Extended();
// Examples of generated values: "0x7.249.0xfe.0x79", "07.0x7b.1.0x6", "0xa5.0265.22.27", "0xd4.0xfd.15664", "0x1ed7207"...

```

Available since 1.17.0.

## ipV6​

IP v6 addresses.

**Signatures:**

- `fc.ipV6()`

**Usages:**

```
fc.ipV6();
// Examples of generated values:
// - "::470:6:192b:ffae:17:2:f"
// - "b1:9:16:0d:3:0157:2.0.3.0"
// - "::54.250.196.255"
// - "b12d:062:04:352:3f:2f:e5a6:4"
// - "::1f58:4b90:7.75.163.156"
// - ...

```

Available since 1.14.0.

## domain​

Domain name values with extension.

Following RFC 1034, RFC 1123 and WHATWG URL Standard.

**Signatures:**

- `fc.domain()`
- `fc.domain({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.domain();
// Examples of generated values: "6i1.ws", "p.s.snp", "r.sc", "gkamh0qv6l.krzi6l5r.nwr", "ewargum4.oe"...
fc.domain({size:'-1'});
// Note: Generate smaller domain name compared to default. As default size is 'small' (if unchanged), it is equivalent to 'xsmall'
// Examples of generated values: "9.pi.ca", "hs3.gzh", "wa5.6.pr", "b.mle", "xwh.t3o.qfy"...
fc.domain({size:'+1'});
// Note: Generate larger domain name compared to default. As default size is 'small' (if unchanged), it is equivalent to 'medium'
// Examples of generated values:
// - "9.p423dsmckvsr8zq9pz4g7m7d-er6s2isixposz852w-6ucuyt6dpd1xom5qw.m13i-0v7it7r-idhdv3r81ih0rkr21vcm03ckml1kinrycchs--xe.7r9699vi87mam0n2n1yiheo5m66b43olq60v4uq0nx2njzln8s9.kcan-6s50hi299hkxwogui-sr-qqag7qk77rp.7.oyydbar"
// - "hsqw8csm6fqkxx-m8bfki5x9ha3b1xwkcrb8434om2a6k.iggl02udkofh9ejc82r0n9d1j3iiebb03htjchbcm4.vrpz5ykhbgw9w70ngv5fibddr0.h4z59i4jgozqyweaiqmsnb1g-xyukd1p56b9rube6bygqql-bix8c1hhe9zl.jzh73innxd9by63zqpgapervfj2tfay9a1yzo1.yvyad"
// - "wa1rmog9vzegsnc0s08c9mw8xhtzi.lczv51ng2.qgrbojlaweyi0dssmu5ynrdo4m2rph-zrmmkmexuives2-33kbu8r5flthpuew1.0hvuvunrwxm46ep19q0g.91z9lzm0o3bk8khhqdfb32lloo.l0ul57f3i6ez24u47taregkn6c95mrx.drgcjivmedhkk"
// - "b.p3avihxjt2f0nz5gyxygckr4zni-1zbz.jnd6n4mvgwhur1.8xvmpgmb9e2lmo0kzqlr3tcqfntktx.9.4j.93gqwgsv-6xdg25i715sg7jul6xbwla.mcnlem"
// - "xwtcyt3pynja1mmoeot1l2x7ue82lbhjuddrogn5ubwjnua.macf28a2x600a9zg25z17rrqgohj89j0ik0cqg91jg4kvhd6-y6.i8syilcl23id4vjxrhyszp8o5ps5h.agm3iek7um94do2ijyt7b6diwqi1i2si-c5xwup.qtgn3lyouk4f7ft57780y7usr0kxox.g.vn"
// - ...

```

Available since 1.14.0.

## webAuthority​

Web authority values.

Following RFC 3986.

**Signatures:**

- `fc.webAuthority()`
- `fc.webAuthority({withIPv4?, withIPv4Extended?, withIPv6?, withPort?, withUserInfo?, size?})`

**with:**

- `withIPv4?` --- default: `false` --- \_enable ip v4
- `withIPv4Extended?` --- default: `false` --- *enable ip v4 extended*
- `withIPv6?` --- default: `false` --- *enable ip v6*
- `withPort?` --- default: `false` --- *enable port*
- `withUserInfo?` --- default: `false` --- *enable user info*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webAuthority();
// Examples of generated values: "23ks1pf.mgz", "7-ngin.sv", "peybeb.f9ia-gsmr.na", "9a1hmsddb-cm.iit", "xhlstwb.44ctb2efxk.fc"...
fc.webAuthority({
withIPv4:true,
});
// Examples of generated values: "i.fb", "237.196.254.199", "7.166.63.117", "wz0zysek.zb", "252.149.163.184"...
fc.webAuthority({
withIPv4Extended:true,
});
// Examples of generated values: "109.013506422", "119.0234.250.04", "df.el", "v.we", "64.020"...
fc.webAuthority({
withIPv4:true,
withIPv4Extended:true,
withIPv6:true,
withPort:true,
});
// Examples of generated values: "0rog.cod:63367", "02.0x57fdd:45172", "0247.0332.0315.0x7a", "2498828715:50719", "169.3.232.223"...

```

Available since 1.14.0.

## webFragments​

Fragments to build an URI.

Fragment is the optional part right after the # in an URI.

**Signatures:**

- `fc.webFragments()`
- `fc.webFragments({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webFragments();
// Examples of generated values: "", "kg%00au@b%08cg", "a", "?x%F1%80%9F%8Cti.k", "%F0%A1%85%AFR%F1%8F%B1%86rQ"...

```

Available since 1.14.0.

## webPath​

Web path.

Following the specs specified by RFC 3986 and WHATWG URL Standard.

**Signatures:**

- `fc.webPath()`
- `fc.webPath({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webPath();
// Examples of generated values: "/X/x///1/j//6/@/", "", "/B/~", "/'//%F4%87%81%B9/B/~/e//P//", "/HzDG-&&)E"...
fc.webPath({size:'+1'});
// Examples of generated values:
// - "/%F1%B7%93%81h&kpL/%F3%96%AA%BFeLb6of/4%F3%B3%80%85%F2%B2%94%B4(t02U/S6y/u_M24BC_%F1%B0%A2%A6t//0bR0co%E2%BD%BB"
// - "/Fxamq,9/%F1%BE%A9%95t=P6-LPgL"
// - "/P.=*%F2%97%A8%93~0i%F2%9A%AC%83/4Rwg0&nSQ/W/Y/+lr!w-kJL/wOq)Xw0KZ"
// - "/@H%F4%8A%91%BFZR:%F2%BA%A7%96O4/%F3%98%90%B8y%F1%B6%96%83+uv%F2%9F%B0%BFf/+/.F%F0%B1%89%88aE%F1%88%A7%BA/~/"
// - "/Bubfb"
// - ...

```

Available since 3.3.0.

## webQueryParameters​

Query parameters to build an URI.

Query parameters part is the optional part right after the ? in an URI.

**Signatures:**

- `fc.webQueryParameters()`
- `fc.webQueryParameters({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webQueryParameters();
// Examples of generated values: "argumentsp", "zB)MCS9r*", "=gcJbW:1", "RmE9%F1%A6%BE%968y:2", "1=eJ@5ic1"...

```

Available since 1.14.0.

## webSegment​

Web URL path segment.

**Signatures:**

- `fc.webSegment()`
- `fc.webSegment({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webSegment();
// Examples of generated values: "*lej@(", "", "+Y", "1FBtTF1GX", "V:%F2%96%A2%A1$PV4Yq"...

```

Available since 1.14.0.

## webUrl​

Web URL values.

Following the specs specified by RFC 3986 and WHATWG URL Standard.

**Signatures:**

- `fc.webUrl()`
- `fc.webUrl({authoritySettings?, validSchemes?, withFragments?, withQueryParameters?, size?})`

**with:**

- `authoritySettings?` --- default: `{}` --- *constraints on the web authority*
- `validSchemes?` --- default: `['http', 'https']` --- *list all the valid schemes*
- `withFragments?` --- default: `false` --- *enable fragments*
- `withQueryParameters?` --- default: `false` --- *enable query parameters*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.webUrl();
// Examples of generated values: "https://1e.pl/", "https://s.snp", "https://h.ot", "https://copze7.wrc/N/", "http://ay84wia.bi/%05/_"...
fc.webUrl({
validSchemes:['ftp','ftps'],
});
// Examples of generated values:
// - "ftps://iq7rvu2my.tm/%F0%91%B3%981V&Hq"
// - "ftp://7eee69dc78fg.nec"
// - "ftp://hye.rbh9r2.hb"
// - "ftp://hmakevcba.uis/~%F3%BC%B3%B2"
// - "ftps://xb1.5787e.cew/d"
// - ...
fc.webUrl({
withFragments:true,
withQueryParameters:true,
});
// Examples of generated values:
// - "https://db.oaurut3lxuey.yc#%F4%84%8D%9Ep%F3%87%81%B8.$/3n7%F3%A7%8F%BB"
// - "http://91kpzb6.x4tmjg.pa//y/%F4%8A%8E%83///?Z7R)=W%F3%A2%95%B1h14"
// - "http://hqydzxt3ihu.db/m/A/M/o/6/?e#%F3%B9%93%B65%F1%B9%A7%B1mx:pU_m"
// - "https://74gl.fp601objrmhm.rx/svxJFoL#"
// - "http://7.qxq?;Y:f@HiK#ref"
// - ...
fc.webUrl({size:'-1'});
// Note: Generate smaller urls compared to default. As default size is 'small' (if unchanged), it is equivalent to 'xsmall'
// Examples of generated values: "https://pi.ca", "https://j.3ch.hy/", "https://5c.f.lbi/", "https://px.hw", "https://dcf.qr"...

```

Available since 1.14.0.

## emailAddress​

Email adresses.

Following RFC 1123 and RFC 5322.

**Signatures:**

- `fc.emailAddress()`
- `fc.emailAddress({size?})`

**with:**

- `size?` --- default: `undefined` more --- *how large should the generated values be?*

**Usages:**

```
fc.emailAddress();
// Examples of generated values:
// - "4@fgqcru.ca"
// - "#!iy8*vt.~#p{nam.y|na.f.afac|.t%^$v*+2di1e.43g@jcc.hl"
// - "fo/2p~zq.kn'e&bfa|1`@9fqau6rah8.8i81fxjk.ox"
// - "==.vra&~to=z.vdc^.=kf/'a$'2sr^.6j6gsw6^&az'.#$}mba.x!|}a@4.wk"
// - "8ic6`_g00syk.}r~b3{0t/7?.!51q'.0yxj2.8wj`f?v-lr}.t6%?z*1$i2+b@cjybzi.pr"
// - ...
fc.emailAddress({size:'-1'});
// Note: Generate smaller email addresses compared to default. As default size is 'small' (if unchanged), it is equivalent to 'xsmall'
// Examples of generated values: "k.wh@l7.pc", "u@j.ag", "p.ag@1f.bj", "d@4.yd", "!@is8.gb"...
```

# Others

# Others

Several other arbitraries.

## falsy​

---

Falsy values.

Generate falsy values ie. one of: `false`, `null`, `undefined`, `0`, `''`, `Number.NaN` or `0n`.

**Signatures:**

- `fc.falsy()`

**Usages:**

```
fc.falsy();
// Examples of generated values: null, 0, false, undefined, ""...
fc.falsy({withBigInt:true});
// Examples of generated values: null, Number.NaN, false, undefined, 0n...

```

Available since 1.26.0.

## context​

---

Generate an instance of `ContextValue` for each predicate run.

`ContextValue` can be used to log stuff within the run itself. In case of failure, the logs will be attached in the counterexample and visible in the stack trace.

**Signatures:**

- `fc.context()`

**Usages:**

```
fc.context();
// The produced value - let's call it ctx - can be used as a logger that will be specific to this run (and only this run).
// It can be called as follow: ctx.log('My log')

```

Available since 1.8.0.

## commands​

---

Iterables of commands.

Model based testing approach extends the power of property based testing to state machines. It relies on commands or operations that a user can run on the system. Those commands define:

- pre-condition --- confirm whether or not the command can be executed given the current context
- execution --- update a simplified context or *model* while updating and checking the *real* system

**Signatures:**

- `fc.commands(commandArbs)`
- `fc.commands(commandArbs, {disableReplayLog?, maxCommands?, size?, replayPath?})`

**with:**

- `commandArbs` --- *array of arbitraries responsible to generate commands*
- `disableReplayLog?` --- default: `false` --- *disable the display of details regarding the replay for commands*
- `maxCommands?` --- default: `0x7fffffff` more --- *maximal number of commands to generate (included)*
- `size?` --- default: `undefined` more --- *how large should the generated values be?*
- `replayPath?` --- *only used when replaying commands*

**Usages:**

```
type Model={/* stuff */};
type Real={/* stuff */};
classCommandAextendsCommand{/* stuff */};
classCommandBextendsCommand{/* stuff */};
// other commands
constCommandsArbitrary= fc.commands([
  fc.constant(newCommandA()),// no custom parameters
  fc.nat().map(s=>newCommandB(s)),// with custom parameter
// other commands
]);
fc.assert(
  fc.property(
CommandsArbitrary,
cmds=>{
consts=()=>({// initial state builder
model:/* new model */,
real:/* new system instance */
});
      fc.modelRun(s, cmds);
}
)
);

```

Available since .

## gen​

---

This arbitrary has been designed to simplify the usage of Property Based Testing. It helps to easily leverage Property Based Testing capabilities into tests based on fake-data.

No replay capabilities

When replaying failures on properties including a `fc.gen()`, you need to drop the path part. More precisely, you may keep the very first part but have to drop anything after the first ":".

Must be called in a deterministic order

Calls to the produced instance must be done in a determistic order.

**Signatures:**

- `fc.gen()`

**Usages:**

```
fc.gen();
// The produced value is a function able to generate random values from arbitraries within the tests themselves.
//
// It takes from 1 to N parameters:
// - the first parameter is a function able to return an arbitrary --- ⚠️ this function must be a static function and not be recreated from one run to another
// - and its parameters as second, third...
//
// It can be called as follow:
// - g(fc.nat) --- building a random value during the predicate using the arbitrary fc.nat()
// - g(fc.nat, {max: 10}) --- same but using fc.nat({max: 10})
//
// ⚠️ But DO NOT USE: g(() => fc.nat({max: 10})).
// In the case right above, neither the builder of arbitrary nor the arbitrary itself are stable references. It would make shrinking impossible.
// If you do need to create a dedicated builder, define it outside of `fc.assert` and use it in your predicate as `g(myBuilder, ...parametersForMyBuilder)`.

```

Available since 3.8.0.

## scheduler​

---

Scheduler for asynchronous tasks.

**Signatures:**

- `fc.scheduler()`
- `fc.scheduler({ act? })`

**with:**

- `act` --- *ensure that all scheduled tasks will be executed in the right context*

# Properties

# Properties

Define your properties.

## Introduction​

---

Properties bring together arbitrary generators and predicates. They are a key building block for property based testing frameworks.

They can be summarized by:

> for any (x, y, ...)
> such that precondition(x, y, ...) holds
> predicate(x, y, ...) is true

Equivalence in fast-check

Each part of the definition can be achieved directly within fast-check:

- "_for any (x, y, ...)_" via arbitraries
- "_such that precondition(x, y, ...) holds_" via `fc.pre` or `.filter`
- "_predicate(x, y, ...) is true_" via the predicate

## Synchronous properties​

---

### Basic​

Synchronous properties define synchronous predicates. They can be declared by calling `fc.property(...arbitraries, predicate)`.

The syntax is the following:

```
fc.property(...arbitraries,(...args)=>{});

```

When passing N arbitraries, the predicate will receive N arguments: first argument being produced by the first arbitrary, second argument by the second arbitrary...

The predicate can:

- either throw in case of failure by relying on `assert`, `expect` or even directly throwing,
- or return `true` or `undefined` for success and `false` for failure.

Beware of side effects

The predicate function should not change the inputs it received. If it needs to, it has to clone them before going on. Impacting the inputs might led to bad shrinking and wrong display on error.

### Advanced​

The built-in property comes with two methods that can be leveraged whenever you need to run setup or teardown steps.

```
fc.property(...arbitraries,(...args)=>{})
.beforeEach((previousBeforeEach)=>{})
.afterEach((previousAfterEach)=>{});

```

They both only accept synchronous functions and give the user the ability to call the previously defined hook function if any. The before-each (respectively: after-each) function will be launched before (respectively: after) each execution of the predicate.

Independent

No need to define both. You may only call `beforeEach` or `afterEach` without the other.

Share them

Consider using `fc.configureGlobal` to share your `beforeEach` and `afterEach` functions across multiple properties.

### Example​

Let's imagine we have a function called `crop` taking a string and the maximal length we accept. We can write the following property:

```
fc.property(fc.nat(), fc.string(),(maxLength, label)=>{
  fc.pre(label.length<= maxLength);// any label such label.length > maxLength, will be dropped
returncrop(label, maxLength)=== label;// true is success, false is failure
});

```

The property defined above is relying on `fc.pre` to filter out invalid entries and is returning boolean values to indicate failures.

It can also be written with `.filter` and `expect`:

```
fc.property(
  fc
.record({
maxLength: fc.nat(),
label: fc.string(),
})
.filter(({ maxLength, label })=> label.length<= maxLength),
({ maxLength, label })=>{
expect(crop(label, maxLength)).toBe(label);
},
);

```

Filtering and performance

Whatever the filtering solution you chose between `fc.pre` or `.filter`, they both consist into generating values and then dropping them. When filter is too strict it means that plenty of values could be rejected for only a few kept.

As a consequence, whenever feasible it's recommended to prefer relying on options directly providing by the arbitraries rather than filtering them. For instance, if you want to generate strings having at least two characters you should prefer `fc.string({ minLength: 2 })` over `fc.string().filter(s => s.length >= 2)`.

## Asynchronous properties​

---

### Basic​

Similarly to their synchronous counterpart, aynchronous properties define asynchronous predicates. They can be declared by calling `fc.asyncProperty(...arbitraries, asyncPredicate)`.

The syntax is the following:

```
fc.asyncProperty(...arbitraries,async(...args)=>{});

```

### Advanced​

They also accept `beforeEach` and `afterEach` functions to be provided: the passed functions can either be synchronous or asynchronous.

Lifecycle

The `beforeEach` and `afterEach` functions will always be executed, regardless of whether the property times out. It's important to note that the `timeout` option passed to `fc.assert` only measures the time taken by the actual property test, not the setup and teardown phases.

# Runners

# Runners

Execute your properties.

## assert​

---

Probably the most useful of all the runners provided within fast-check. This runner takes a property and executes it. It throws automatically in case of failure. Thrown error is formatted to make it easily readable and actionable for the user.

Its signature can be summarized by:

```
functionassert<Ts>(property: IProperty<Ts>, params?: Parameters<Ts>):void;
functionassert<Ts>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>):Promise<void>;

```

tip

Check `Parameters` to run `assert` with advanced options.

## check​

---

Similar to `assert` except that caller is responsible to handle the output.

In terms of signatures, `check` provides the following:

```
functioncheck<Ts>(property: IProperty<Ts>, params?: Parameters<Ts>): RunDetails<Ts>;
functioncheck<Ts>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>):Promise<RunDetails<Ts>>;

```

The structure `RunDetails` provides all the details needed to report what happened. There are four major reasons for `check` to end:

| Reasons                                                 | `failed` | `interrupted`  | `counterexample`/`counterexamplePath`/`error` |
| ------------------------------------------------------- | -------- | -------------- | --------------------------------------------- |
| failure of the predicate                                | `true`   | `true`/`false` | _not null_                                    |
| ---                                                     | ---      | ---            | ---                                           |
| too many pre-conditions failures                        | `true`   | `false`        | `null`                                        |
| execution took too long given `interruptAfterTimeLimit` | `true`   | `true`         | `null`                                        |
| successful run                                          | `false`  | `true`/`false` | `null`                                        |

Rewrite `assert` with `check`

```
functionassert(property, params){
// In this example we only support synchronous properties.
// To support both of them, you could use `property.isAsync()` and `asyncDefaultReportMessage`.
const out = fc.check(property, params);
if(out.failed){
thrownewError(fc.defaultReportMessage(out),{cause: out.errorInstance});
}
}

```

## sample​

---

Certainly one of the most useful when attempting to create your own arbitraries. `sample` gives you a way to extract very quickly what would be the values generated by your arbitrary.

Its signature is:

```
functionsample<Ts>(generator: IRawProperty<Ts,boolean>| Arbitrary<Ts>, params?:number| Parameters<Ts>): Ts[];

```

Available since 0.0.6.

## statistics​

---

When building a new arbitrary, knowing what would be the generated values is a thing but checking how well they cover the range of possible values is also crucial in some cases. `statistics` can be seen as a refinement over `sample`. It helps users to properly design their own arbitraries and check how efficient they will be.

Its signature is:

```
functionstatistics<Ts>(
  generator: IRawProperty<Ts,boolean>| Arbitrary<Ts>,
classify:(v: Ts)=>string|string[],
  params?:number| Parameters<Ts>,
):void;

```

Example of usage:

```
fc.statistics(
  fc.string(),// source arbitrary
(v)=>`${v.length} characters`,// classifier
{numRuns:100_000},// extra parameters
);
// Possible output:
// >  0 characters...9.65%
// >  2 characters...9.56%
// >  1 characters...9.41%
// >  3 characters...9.30%
// >  6 characters...9.04%
// >  9 characters...8.92%
// >  7 characters...8.90%
// >  8 characters...8.90%
// >  10 characters..8.86%
// >  4 characters...8.79%
// >  5 characters...8.68%
```

# Fuzzing

# Fuzzing

Turn fast-check into a fuzzer

## From Property-Based to Fuzzing​

Although fast-check is not specifically designed as a fuzzer, it has several features that make it well-suited for this purpose. One such feature is its ability to repeatedly run a predicate against randomized data, which is a fundamental requirement for fuzzing. Additionally, fast-check is capable of identifying and reporting errors, which is crucial in fuzzing scenarios.

Due to its sophisticated random generators, fast-check can be a valuable tool for detecting critical bugs in your code and can be leveraged in a fuzzing mode.

If you want to use fast-check as a fuzzer, here's how to get started.

## Basic setup​

To use fast-check as a fuzzer, the primary requirement is to execute the predicate against a large number of runs. One straightforward method of achieving this is to customize the `numRuns` value passed to the runner.

For instance, if you intend to run the tests an infinite number of times, you can use the following code snippet:

```
fc.configureGlobal({numRuns:Number.POSITIVE_INFINITY});

```

Multi-process

Please note that if you intend to run multiple properties an infinite number of times, it may be necessary to run them via multiple processes. JavaScript being a single-threaded language, running multiple infinite loops in a single thread may result in only one property being executed.

Therefore, to avoid this limitation and ensure that all properties are executed as intended, you should consider running them in separate processes.

## Advanced setup​

While the setup above will continue to run until fast-check uncovers a bug, you may want to consider more advanced patterns if your goal is to continuously fuzz the code without stopping even in the event of an error.

The following code snippets offer an approach to run fast-check continuously without stopping on failure.

### Never failing predicates​

The code snippet presented below consists of a function designed to wrap any predicate into a function that will not fail but will report into a file when a failure is detected.

```
importfcfrom'fast-check';
importfsfrom'fs';
importprocessfrom'process';
let failureId =0;
functionreportFailure(inputs, error){
const fileName =`failure-pid${process.pid}-${++failureId}.log`;
const fileContent =`Counterexample: ${fc.stringify(inputs)}\n\nError: ${error}`;
  fs.writeFile(fileName, fileContent);
}
functionneverFailingPredicate(predicate){
return(...inputs)=>{
try{
const out =predicate(...inputs);
if(out ===false){
reportFailure(inputs,undefined);
}
}catch(err){
reportFailure(inputs, err);
}
};
}

```

The `neverFailingPredicate` function takes in a predicate and returns a new function that wraps it. This new function will catch any error thrown by the predicate and report it as a failure, without actually failing. Additionally, it will generate a log file containing the counterexample that caused the failure and the error message.

This function can be used to run fast-check indefinitely without stopping on errors.

### Fuzzing usage​

The above helpers can be utilized directly to define properties and execute them in a fuzzer fashion as shown below:

```
importfcfrom'fast-check';
fc.configureGlobal({numRuns:1_000_000});
test('fuzz predicate against arbitraries',()=>{
  fc.assert(fc.property(...arbitraries,neverFailingPredicate(predicate)));
});

```

Here, the `assert` function is used to execute a property that is generated from a set of arbitraries. The `neverFailingPredicate` function is used to wrap the predicate of the property, which ensures that the property will never fail but will report any detected failures.

Finally, the `configureGlobal` function is used to set the number of runs for the property to `1_000_000`, enabling it to run longer than the default setup.

### Replay usage​

In contrast to normal runs, when using the `neverFailingPredicate` function, the inputs provided to the predicate will never be shrunk. However, if you want to shrink them or just replay the failure, you can do it on a case-by-case basis as demonstrated below:

```
test('replay reported error and shrink it',()=>{
  fc.assert(fc.property(...arbitraries, predicate),{
numRuns:1,
examples:[
[
/* reported error */
],
],
});
});

```

Here, the `examples` option is used to provide the input that resulted in the reported error. By setting `numRuns` to 1, we ensure that the property is only executed once with the provided example. In case of failure, fast-check will then attempt to shrink the input, leading to a simpler failing input if feasible.

# Race Conditions

# Race conditions

Easily detect race conditions in your JavaScript code

## Overview​

---

Race conditions can easily occur in JavaScript due to its event-driven nature. Any situation where JavaScript has the ability to schedule tasks could potentially lead to race conditions.

> A race condition \[...\] is the condition \[...\] where the system's substantive behavior is dependent on the **sequence** or timing of other **uncontrollable events**.

_Source: <https://en.wikipedia.org/wiki/Race_condition>_

Identifying and fixing race conditions can be challenging as they can occur unexpectedly. It requires a thorough understanding of potential event flows and often involves using advanced debugging and testing tools.
To address this issue, fast-check includes a set of built-in tools specifically designed to help in detecting race conditions. The `scheduler` arbitrary has been specifically designed for detecting and testing race conditions, making it an ideal tool for addressing these challenges in your testing process.

## The scheduler instance​

---

The `scheduler` arbitrary is able to generate instances of `Scheduler`. They come with following interface:

- `schedule: <T>(task: Promise<T>, label?: string, metadata?: TMetadata, act?: SchedulerAct) => Promise<T>` \- Wrap an existing promise using the scheduler. The newly created promise will resolve when the scheduler decides to resolve it (see `waitOne` and `waitAll` methods).
- `scheduleFunction: <TArgs extends any[], T>(asyncFunction: (...args: TArgs) => Promise<T>, act?: SchedulerAct) => (...args: TArgs) => Promise<T>` \- Wrap all the promise produced by an API using the scheduler. `scheduleFunction(callApi)`
- `scheduleSequence(sequenceBuilders: SchedulerSequenceItem<TMetadata>[], act?: SchedulerAct): { done: boolean; faulty: boolean, task: Promise<{ done: boolean; faulty: boolean }> }` \- Schedule a sequence of operations. Each operation requires the previous one to be resolved before being started. Each of the operations will be executed until its end before starting any other scheduled operation.
- `count(): number` \- Number of pending tasks waiting to be scheduled by the scheduler.
- `waitOne: (act?: SchedulerAct) => Promise<void>` \- Wait one scheduled task to be executed. Throws if there is no more pending tasks.
- `waitAll: (act?: SchedulerAct) => Promise<void>` \- Wait all scheduled tasks, including the ones that might be created by one of the resolved task. Do not use if `waitAll` call has to be wrapped into an helper function such as `act` that can relaunch new tasks afterwards. In this specific case use a `while` loop running while `count() !== 0` and calling `waitOne` \- *see CodeSandbox example on userProfile*.
- `waitFor: <T>(unscheduledTask: Promise<T>, act?: SchedulerAct) => Promise<T>` \- Wait as many scheduled tasks as need to resolve the received task. Contrary to `waitOne` or `waitAll` it can be used to wait for calls not yet scheduled when calling it (some test solutions like supertest use such trick not to run any query before the user really calls then on the request itself). Be aware that while this helper will wait eveything to be ready for `unscheduledTask` to resolve, having uncontrolled tasks triggering stuff required for `unscheduledTask` might make replay of failures harder as such asynchronous triggers stay out-of-control for fast-check.
- `report: () => SchedulerReportItem<TMetaData>[]` \- Produce an array containing all the scheduled tasks so far with their execution status. If the task has been executed, it includes a string representation of the associated output or error produced by the task if any.
  Tasks will be returned in the order they get executed by the scheduler.

With:

```
typeSchedulerSequenceItem<TMetadata>=
|{builder:()=>Promise<any>; label:string; metadata?: TMetadata }
|(()=>Promise<any>);

```

You can also define an hardcoded scheduler by using `fc.schedulerFor(ordering: number[])` \- *should be passed through `fc.constant` if you want to use it as an arbitrary*. For instance: `fc.schedulerFor([1,3,2])` means that the first scheduled promise will resolve first, the third one second and at the end we will resolve the second one that have been scheduled.

## Scheduling methods​

---

### schedule​

Create a scheduled `Promise` based on an existing one --- *aka. wrapped `Promise`*. The life-cycle of the wrapped `Promise` will not be altered at all. On its side the scheduled `Promise` will only resolve when the scheduler decides it.

Once scheduled by the scheduler, the scheduler will wait the wrapped `Promise` to resolve before sheduling anything else.

Catching exceptions is your responsability

Similar to any other `Promise`, if there is a possibility that the wrapped `Promise` may be rejected, you have to handle the output of the scheduled `Promise` on your end, just as you would with the original `Promise`.

**Signature**

```
schedule:<T>(task:Promise<T>)=>Promise<T>;
schedule:<T>(task:Promise<T>, label?:string, metadata?: TMetadata, customAct?: SchedulerAct)=>Promise<T>;

```

**Usage**

Any algorithm taking raw `Promise` as input might be tested using this scheduler.

For instance, `Promise.all` and `Promise.race` are examples of such algorithms.

**Snippet**

```
// Let suppose:
// - s        : Scheduler
// - shortTask: Promise   - Very quick operation
// - longTask : Promise   - Relatively long operation
shortTask.then(()=>{
// not impacted by the scheduler
// as it is directly using the original promise
});
const scheduledShortTask = s.schedule(shortTask);
const scheduledLongTask = s.schedule(longTask);
// Even if in practice, shortTask is quicker than longTask
// If the scheduler selected longTask to end first,
// it will wait longTask to end, then once ended it will resolve scheduledLongTask,
// while scheduledShortTask will still be pending until scheduled.
await s.waitOne();

```

### scheduleFunction​

Create a producer of scheduled `Promise`.

Many asynchronous codes utilize functions that can produce `Promise` based on inputs. For example, fetching from a REST API using `fetch("http://domain/")` or accessing data from a database `db.query("SELECT * FROM table")`.

`scheduleFunction` is able to re-order when these `Promise` resolveby waiting the go of the scheduler.

**Signature**

```
scheduleFunction:<TArgs extendsany[],T>(asyncFunction:(...args: TArgs)=>Promise<T>, customAct?: SchedulerAct)=>
(...args: TArgs)=>
Promise<T>;

```

**Usage**

Any algorithm making calls to asynchronous APIs can highly benefit from this wrapper to re-order calls.

Only postpone the resolution

`scheduleFunction` is only postponing the resolution of the function. The call to the function itself is started immediately when the caller calls something on the scheduled function.

**Snippet**

```
// Let suppose:
// - s             : Scheduler
// - getUserDetails: (uid: string) => Promise - API call to get details for a User
const getUserDetailsScheduled = s.scheduleFunction(getUserDetails);
getUserDetailsScheduled('user-001')
// What happened under the hood?
// - A call to getUserDetails('user-001') has been triggered
// - The promise returned by the call to getUserDetails('user-001') has been registered to the scheduler
.then((dataUser001)=>{
// This block will only be executed when the scheduler
// will schedule this Promise
});
// Unlock one of the scheduled Promise registered on s
// Not necessarily the first one that resolves
await s.waitOne();

```

### scheduleSequence​

Create a sequence of asynchrnous calls running in a precise order.

While running, tasks prevent others to complete

One important fact about scheduled sequence is that whenever one task of the sequence gets scheduled, no other scheduled task in the scheduler can be unqueued while this task has not ended.
It means that tasks defined within a scheduled sequence must not require other scheduled task to end to fulfill themselves --- *it does not mean that they should not force the scheduling of other scheduled tasks*.

**Signature**

```
typeSchedulerSequenceItem=
{builder:()=>Promise<any>; label:string}|
(()=>Promise<any>)
;
scheduleSequence(sequenceBuilders: SchedulerSequenceItem[], customAct?: SchedulerAct):{ done:boolean; faulty:boolean, task:Promise<{ done:boolean; faulty:boolean}>}

```

**Usage**

You want to check the status of a database, a webpage after many known operations.

Alternative

Most of the time, model based testing might be a better fit for that purpose.

**Snippet**

```
// Let suppose:
// - s: Scheduler
const initialUserId ='001';
const otherUserId1 ='002';
const otherUserId2 ='003';
// render profile for user {initialUserId}
// Note: api calls to get back details for one user are also scheduled
const{ rerender }=render(<UserProfilePageuserId={initialUserId}/>);
s.scheduleSequence([
async()=>rerender(<UserProfilePageuserId={otherUserId1}/>),
async()=>rerender(<UserProfilePageuserId={otherUserId2}/>),
]);
await s.waitAll();
// expect to see profile for user otherUserId2

```

## Advanced recipes​

---

### Scheduling a function call​

In some tests, we may want to experiment with scenarios where multiple queries are launched concurrently towards our service to observe its behavior in the context of concurrent operations.

```
const scheduleCall =<T>(s: Scheduler,f:()=>Promise<T>)=>{
  s.schedule(Promise.resolve('Start the call')).then(()=>f());
};
// Calling doStuff will be part of the task scheduled in s
scheduleCall(s,()=>doStuff());

```

### Scheduling a call to a mocked server​

Unlike the behavior of `scheduleFunction`, actual calls to servers are not instantaneous, and you may want to schedule when the call reaches your mocked-server.

For instance, suppose you are creating a TODO-list application. In this app, users can only add a new TODO item if there is no other item with the same label. If you utilize the built-in `scheduleFunction` to test this feature, the mocked-server will always receive the calls in the same order as they were made.

```
const scheduleMockedServerFunction =<TArgs extendsunknown[], TOut>(
  s: Scheduler,
f:(...args: TArgs)=>Promise<TOut>,
)=>{
return(...args: TArgs)=>{
return s.schedule(Promise.resolve('Server received the call')).then(()=>f(...args));
};
};
const newAddTodo =scheduleMockedServerFunction(s,(label)=> mockedApi.addTodo(label));
// With newAddTodo = s.scheduleFunction((label) => mockedApi.addTodo(label))
// The mockedApi would have received todo-1 first, followed by todo-2
// When each of those calls resolve would have been the responsibility of s
// In the contrary, with scheduleMockedServerFunction, the mockedApi might receive todo-2 first.
newAddTodo('todo-1');// .then
newAddTodo('todo-2');// .then
// or...
const scheduleMockedServerFunction =<TArgs extendsunknown[], TOut>(
  s: Scheduler,
f:(...args: TArgs)=>Promise<TOut>,
)=>{
const scheduledF = s.scheduleFunction(f);
return(...args: TArgs)=>{
return s.schedule(Promise.resolve('Server received the call')).then(()=>scheduledF(...args));
};
};

```

### Wrapping calls automatically using `act`​

`scheduler` can be given an `act` function that will be called in order to wrap all the scheduled tasks. A code like the following one:

```
fc.assert(
  fc.asyncProperty(fc.scheduler(),asyncs=>(){
// Pushing tasks into the scheduler ...
// ....................................
while(s.count()!==0){
awaitact(async()=>{
// This construct is mostly needed when you want to test stuff in React
// In the context of act from React, using waitAll would not have worked
// as some scheduled tasks are triggered after waitOne resolved
// and because of act (effects...)
await s.waitOne();
});
}
}))

```

Is equivalent to:

```
fc.assert(
  fc.asyncProperty(fc.scheduler({ act }),asyncs=>(){
// Pushing tasks into the scheduler ...
// ....................................
await s.waitAll();
}))

```

This pattern can be helpful whenever you need to make sure that continuations attached to your tasks get called in proper contexts. For instance, when testing React applications, one cannot perform updates of states outside of `act`.

Finer act

The `act` function can be defined on case by case basis instead of being defined globally for all tasks. Check the `act` argument available on the methods of the scheduler.

### Scheduling native timers​

Occasionally, our asynchronous code depends on native timers provided by the JavaScript engine, such as `setTimeout` or `setInterval`. Unlike other asynchronous operations, timers are ordered, meaning that a timer set to wait for 10ms will be executed before a timer set to wait for 100ms. Consequently, they require special handling.

The code snippet below defines a custom `act` function able to schedule timers. It uses Jest, but it can be modified for other testing frameworks if necessary.

```
// You should call: `jest.useFakeTimers()` at the beginning of your test
// The function below automatically schedules tasks for pending timers.
// It detects any timer added when tasks get resolved by the scheduler (via the act pattern).
// Instead of calling `await s.waitFor(p)`, you can call `await s.waitFor(p, buildWrapWithTimersAct(s))`.
// Instead of calling `await s.waitAll()`, you can call `await s.waitAll(buildWrapWithTimersAct(s))`.
functionbuildWrapWithTimersAct(s: fc.Scheduler){
let timersAlreadyScheduled =false;
functionscheduleTimersIfNeeded(){
if(timersAlreadyScheduled || jest.getTimerCount()===0){
return;
}
    timersAlreadyScheduled =true;
    s.schedule(Promise.resolve('advance timers')).then(()=>{
      timersAlreadyScheduled =false;
      jest.advanceTimersToNextTimer();
scheduleTimersIfNeeded();
});
}
returnasyncfunctionwrapWithTimersAct(f:()=>Promise<unknown>){
try{
awaitf();
}finally{
scheduleTimersIfNeeded();
}
};
}
```

# Your first race condition test

## Code under test​

For the next few pages, we will focus on a function called `queue`. Its purpose is to wrap an asynchronous function and queue subsequent calls to it in two ways:

- Promises returned by the function will resolve in order, with the first call resolving before the second one, the second one resolving before the third one, and so on.
- Concurrent calls are not allowed, meaning that a call will always wait for the previously started one to finish before being fired.

In the context of this tutorial you'll never have to edit `queue`. The function will be provided to you.

## Understand current test​

Fortunately, we don't have to start from scratch. The function already has a test in place that ensures queries will consistently resolve in the correct order. The test appears rather simple and currently passes.

```
test('should resolve in call order',async()=>{
// Arrange
const seenAnswers =[];
const call = jest.fn().mockImplementation((v)=>Promise.resolve(v));
// Act
const queued =queue(call);
awaitPromise.all([queued(1).then((v)=> seenAnswers.push(v)),queued(2).then((v)=> seenAnswers.push(v))]);
// Assert
expect(seenAnswers).toEqual([1,2]);
});

```

If we look closer to the test, we can observe that the wrapped function is relatively straightforward in that it merely returns a resolved promise whose value corresponds to the provided input.

```
const call = jest.fn().mockImplementation((v)=>Promise.resolve(v));

```

We can also see that we assess the order of results by confirming that the values pushed into `seenAnswers` are properly ordered. It's worth noting that `seenAnswers` does not represent the same thing as `await Promise.all([queued(1), queued(2)])`. This alternative notation does not evaluate the order in which the resolutions are received, but rather only confirms that each query resolves to its expected value.

## Towards next test​

The test above has some limitations. Namely, the promises and their `.then()` callbacks happen to resolve in the correct order only because they were instantiated in the correct order and they did not `await` to yield control back to the JavaScript event loop (because we use `Promise.resolve()`). In other words, we are just testing that the JavaScript event loop is queueing and processing promises in the correct order, which is hopefully already true!

In order to address this limitation, our updated test should ensure that promises resolve later rather than instantly.

## First glance at schedulers​

When adding fast-check into a race condition test, the recommended initial step is to update the test code as follows:

```
test('should resolve in call order',async()=>{
await fc.assert(fc.asyncProperty(fc.scheduler(),async(s)=>{// <-- added
// ...unchanged code...
}));// <-- added
});

```

This modification runs the test using the fast-check runner. By doing so, any bugs that arise during the predicate will be caught by fast-check.

In the context of race conditions, we want fast-check to provide us with a scheduler instance that is capable of re-ordering asynchronous operations. This is why we added the `fc.scheduler()` argument: it creates an instance of a scheduler that we refer to as `s`. The first important thing to keep in mind for our new test is that we don't want to change the value returned by the API. But we want to change when it gets returned. We want to give the scheduler the responsibility of resolving API calls. To achieve this, the scheduler exposes a method called `scheduleFunction`. This method wraps a function in a scheduled or controlled version of itself.

After pushing scheduled calls into the scheduler, we must execute and release them at some point. This is typically done using `waitAll` or `waitFor`. These APIs simply wait for `waitX` to resolve, indicating that what we were waiting for has been accomplished.

Which wait is the best?

For this first iteration, both of them will be ok, but we will see later that `waitFor` is probably a better fit in that specific example.

# Multiple batches of calls

## Zoom on previous test​

---

### The choice of integer​

In the previous part, we suggested to run the test against an arbitrary number of calls to `call`. The option we recommend and implemented is based on `integer` arbitrary. We use it to give us the number of calls we should do.

```
const queued =queue(s.scheduleFunction(call));
for(let id =0; id !== numCalls;++id){
  expectedAnswers.push(id);
  pendingQueries.push(queued(id).then((v)=> seenAnswers.push(v)));
}
await s.waitFor(Promise.all(pendingQueries));

```

We based our choice on the fact that the `queue` helper is designed to accept any input, regardless of its value. Thus, there was no particular reason to generate values for the inputs themselves, as they are never consumed by the logic of `queue`. Using integers from 0 onwards allows for simpler debugging, as opposed to arbitrary inputs like 123 or 45.

### The array version​

Here is how we could have written the array alternative:

```
// ids being the result of fc.array(fc.nat(), {minLength: 1})
const queued =queue(s.scheduleFunction(call));
for(const id of ids){
  expectedAnswers.push(id);
  pendingQueries.push(queued(id).then((v)=> seenAnswers.push(v)));
}
await s.waitFor(Promise.all(pendingQueries));

```

## Towards next test​

---

Our current test doesn't fully capture all possible issues that could arise. In fact, the previous implementation sent all requests at the same time in a synchronous way, without firing some, waiting a bit, and then firing others.

In the next iteration, we aim to declare and run multiple batches of calls: firing them in order will simplify our expectations.

To run things in an ordered way in fast-check, we need to use what we call scheduled sequences. Scheduled sequences can be declared by using the helper `scheduleSequence`. When running scheduled tasks, fast-check interleaves parts coming from sequences in-between and ensures that items in a sequence are run and waited for in order. This means that an item in the sequence will never start before the one before it has stopped. To declare and use a sequence, you can follow the example below:

```
const{ task }= s.scheduleSequence([
async()=>{
// 1st item:
// Runnning something for the 1st item.
},
async()=>{
// 2nd item:
// Runnning something for the 2nd item.
// Will never start before the end of `await firstItem()`.
// Will have to be scheduled by the runner to run, in other words, it may start
// very long after the 1st item.
},
]);
// The sequence also provides a `task` that can be awaited in order to know when all items
// of the sequence have been fully executed. It also provides other values such as done or
// faulty if you want to know bugs that may have occurred during the sechduling of it.

```

Non-batched alternative?

We will discuss about a non-batched alternative in the next page. The batch option we suggest here has the benefit to make you use the `scheduleSequence` helper coming with fast-check.

# Wrapping up

## Zoom on previous test​

---

Congratulations! You have learned how to detect race conditions using fast-check library. We explored the concept of race conditions, discussed their potential dangers, and demonstrated various techniques to identify them. By leveraging the powerful features of fast-check, such as property-based testing and shrinking, you now have a robust tool at your disposal to uncover and fix race conditions in your code. Remember to apply these techniques in your projects to ensure the reliability and stability of your software.

Throughout this tutorial, we gradually added race condition detection and expanded its coverage. The final iteration brings us close to fully addressing all possible edge cases of a `queue`.

One important aspect of the last added test is that it covers a specification point we had overlooked in previous iterations. The main change involved ensuring that we never get called twice simultaneously but always get queued. We accomplished this by replacing:

```
//...
const scheduledCall = s.scheduleFunction(call);
const queued =queue(scheduledCall);
//...
expect(concurrentQueriesDetected).toBe(false);
//...

```

with:

```
//...
const scheduledCall = s.scheduleFunction(call);
let concurrentQueriesDetected =false;
let queryPending =false;
constmonitoredScheduledCall=(...args)=>{
  concurrentQueriesDetected ||= queryPending;
  queryPending =true;
returnscheduledCall(...args).finally(()=>(queryPending =false));
};
const queued =queue(monitoredScheduledCall);
//...
expect(concurrentQueriesDetected).toBe(false);
//...

```

The above change ensures that we can detect whenever `scheduledCall` is called before the previous calls to it have resolved.

## Towards next test​

---

Although we have covered the majority of the `queue` algorithm, there are always subtle aspects that we may want to address. In this section, we will provide you with some ideas to ensure that your implementation of `queue` is perfect. All the suggested changes have been implemented in the CodeSandbox playground below, allowing you to see how they can be achieved. The tests associated with this section have been named `*.pnext.v*` and are stacked on top of each other, with the final test incorporating all the suggestions described in this section.

### Synchronous calls​

While we previously rejected the approach in the first part of the tutorial, we could have considered that calls are expected to be fired synchronously. To achieve this, we can rely on `waitAll` and eliminate any code responsible to wait for the batch to be executed or for promises to resolve.

Here is what we mean by not firing calls synchronously: this snippet does not execute calls in a synchronous manner. Instead, each call is queued and executed after the previous one has resolved:

```
let previous =Promise.resolve();
functionfireCall(call){
  previous = previous.then(()=>call());
}

```

To demonstrate this behavior, you can run the following snippet locally:

```
console.log('before fireCall');
fireCall(async()=>console.log('call'));
console.log('after fireCall');
// Results:
// >  before fireCall
// >  after fireCall
// >  call

```

Let's explore different iterations attempting to enhance this snippet. Here's a naive attempt that addresses the issue for the first call, but it is still incomplete:

```
let previous =undefined;
functionfireCall(call){
if(previous ===undefined){
    previous =call();
}else{
    previous = previous.then(()=>call());
}
}

```

While the above solution improves the situation for the first call, it doesn't handle subsequent calls properly. The issue on second call is highlighted by the following snippet:

```
functionrunOne(){
returnnewPromise((resolve)=>{
console.log('before fireCall');
fireCall(async()=>{
console.log('call');
resolve();
});
console.log('after fireCall');
});
}
awaitrunOne();
awaitrunOne();
// Results:
// >  before fireCall
// >  call
// >  after fireCall
// >  before fireCall
// >  after fireCall
// >  call

```

Here is a more advanced but still not perfect implementation of `fireCall`:

```
let callId =0;
let previous =undefined;
functionfireCall(call){
const currentCallId =++callId;
const next = previous ===undefined?call(): previous.then(()=>call());
  previous = next.then(()=>{
if(callId === currentCallId){
      previous =undefined;
}
});
}

```

This last iteration, implemented in `src/queue.v4.js`, represents the most advanced solution we will show in that section. However, if you examine the CodeSandbox playground\](#have-fun), you'll notice that even this implementation misses some cases and can be fixed.

### Support exceptions​

When working with asynchronous code, it is common to encounter situations where code can potentially throw errors. As this scenario may occur in production code, it is essential to test our helper against such cases as well.

To enhance our existing tests with this capability, we can modify our mock `call` implementation to simulate both successful executions and error throws. Consequently, our expectations need to be adjusted, but the underlying idea remains the same: both successes and failures should be received in an ordered manner.

## Testing user interfaces​

---

The pattern we have introduced in this tutorial can be extended to address race conditions that may occur in user interfaces. Whether you are working with React components, Vue components, or any other frameworks, you can apply the techniques covered here without any issues.

In fact, the concepts and principles discussed in this tutorial are applicable beyond the scope of the specific examples provided. By leveraging property-based testing and incorporating race condition detection into your UI development workflow, you can enhance the reliability and stability of your applications.

To delve deeper into this extension and gain a comprehensive understanding of applying these concepts on user interfaces, you can watch the following video:

# zod-fast-check

A small library to automatically derive fast-check arbitraries from schemas defined using the validation library Zod. These enables easy and thorough property-based testing.

## Usage

Here is a complete example using Jest.

```
import \* as z from "zod";
import \* as fc from "fast-check";
import { ZodFastCheck } from "zod-fast-check";

// Define a Zod schema
const User \= z.object({
  firstName: z.string(),
  lastName: z.string(),
});

// Define an operation using the data type
function fullName(user: unknown): string {
  const parsedUser \= User.parse(user);
  return \`${parsedUser.firstName} ${parsedUser.lastName}\`;
}

// Create an arbitrary which generates valid inputs for the schema
const userArbitrary \= ZodFastCheck().inputOf(User);

// Use the arbitrary in a property-based test
test("User's full name always contains their first and last names", () \=>
  fc.assert(
    fc.property(userArbitrary, (user) \=> {
      const name \= fullName(user);
      expect(name).toContain(user.firstName);
      expect(name).toContain(user.lastName);
    })
  ));
```

The main interface is the `ZodFastCheck` class, which has the following methods:

### inputOf

`inputOf<Input>(zodSchema: ZodSchema<unknown, ZodTypeDef, Input>): Arbitrary<Input>`

Creates an arbitrary which will generate values which are valid inputs to the schema. This should be used for testing functions which use the schema for validation.

### outputOf

`outputOf<Output>(zodSchema: ZodSchema<Output, ZodTypeDef, unknown>): Arbitrary<Output>`

Creates an arbitrary which will generate values which are valid outputs of parsing the schema. This means any transformations have already been applied to the values.
This should be used for testing functions which do not use the schema directly, but use data parsed by the schema.

### override

`override<Input>(schema: ZodSchema<unknown, ZodTypeDef, Input>, arbitrary: Arbitrary<Input>): ZodFastCheck`

Returns a new `ZodFastCheck` instance which will use the provided arbitrary when generating inputs for the given schema. This includes if the schema is used as a component of a larger schema.

For example, if we have a schema which validates that a string has a prefix, we can define an override to produce valid values.

```
const WithFoo \= z.string().regex(/^foo/);

const zodFastCheck \= ZodFastCheck().override(
  WithFoo,
  fc.string().map((s) \=> "foo" + s)
);

const arbitrary \= zodFastCheck.inputOf(z.array(WithFoo));
```

Schema overrides are matched based on object identity, so you need to define the override using the exact schema object, rather than an equivalent schema.

If you need to use zod-fast-check to generate the override, it is easy to end up with a circular dependency. You can avoid this by defining the override lazily using a function. This function is called with the `ZodFastCheck` instance as an argument.

```
const WithFoo \= z.string().regex(/^foo/);

const zodFastCheck \= ZodFastCheck().override(WithFoo, (zfc) \=>
  zfc.inputOf(z.string()).map((s) \=> "foo" + s)
);

const arbitrary \= zodFastCheck.inputOf(z.array(WithFoo));
```

## Supported Zod Schema Features

### Data types

✅ string (including email, datetime, UUID and URL)
✅ number
✅ nan
✅ bigint
✅ boolean
✅ date
✅ undefined
✅ null
✅ symbol ✅ array
✅ object
✅ union
✅ discriminated union
✅ tuple
✅ record
✅ map
✅ set
✅ function
✅ literal
✅ enum
✅ nativeEnum
✅ promise
✅ any
✅ unknown
✅ void
✅ optional
✅ nullable
✅ default
✅ branded types
✅ transforms
✅ refinements (see below)
✅ pipe
✅ catch
❌ intersection
❌ lazy
❌ never

### Refinements

Refinements are supported, but they are produced by filtering the original arbitrary by the refinement function. This means that for refinements which have a very low probability of matching a random input, it will not be able to generate valid values.
This is most common when using refinements to check that a string matches a particular format. If this occurs, it will throw a `ZodFastCheckGenerationError`.

In cases like this, it is recommended to define an override for the problematic subschema.

# @fast-check/worker

====================

Provide built-ins to run predicates directly within dedicated workers

## Why?

`fast-check` alone is great but what if it led your code into an infinite and synchronous loop for such inputs?
In such case, it would neither be able to shrink the issue, nor to report any for you as the single threaded philosophy at the root of JavaScript will prevent it from anything except waiting for the main thread to come back.

This package tends to provide a way to run easily your properties within dedicated workers automatically spawed by it.

## Example

Here are some of the changes you will have to do:

- hoist properties so that they get declared on the root scope
- replace `fc.property` by `property` coming from `propertyFor(<path-to-file>)`
- replace `fc.assert` by `assert` coming from `@fast-check/worker` for automatic cleaning of the workers as the test ends
- transpilation has not been addressed yet but it may probably work
- in theory, if you were only using `propertyFor` and `assert` without any external framework for `test`, `it` and others, the separation of the property from the assertion would be useless as the check for main thread is fully handled within `@fast-check/worker` itself so no hoisting needing in such case

```
import { test } from '@jest/globals';
import fc from 'fast-check';
import { isMainThread } from 'node:worker\_threads';
import { assert, propertyFor } from '@fast-check/worker';

const property \= propertyFor(new URL(import.meta.url)); // or propertyFor(pathToFileURL(\_\_filename)) in commonjs
const p1 \= property(fc.nat(), fc.nat(), (start, end) \=> {
  // starting a possibly infinite loop
  for (let i \= start; i !== end; ++i) {
    // doing stuff...
  }
});

if (isMainThread) {
  test('should assess p1', async () \=> {
    await assert(p1, { timeout: 1000 });
  });
}
```

Refer to the tests defined `test/main.spec.ts` for a living example of how you can use this package with a test runner such as Jest.

## Extra options

The builder of properties `propertyFor` accepts a second parameter to customize how the workers will behave. By default, workers will be shared across properties. In case you want a more isolation between your runs, you can use:

```
const property \= propertyFor(new URL(import.meta.url), { isolationLevel: 'predicate' });
// Other values:
// - "file": Re-use workers cross properties (default)
// - "property": Re-use workers for each run of the predicate. Not shared across properties!
// - "predicate": One worker per run of the predicate
```

By default, workers will receive the generated values from their parent thread. In some cases, such sending is made impossible as the generated values include non-serializable pieces. In such cases, you can opt-in to generate the values directly within the workers by using:

```
const property \= propertyFor(new URL(import.meta.url), { randomSource: 'worker' });
// Other values:
// - "main-thread": The main thread will be responsible to generate the random values and send them to the worker thread. It unfortunately cannot send any value that cannot be serialized between threads. (default)
// - "worker": The worker is responsible to generate its own values based on the instructions provided by the main thread. Switching to a worker mode allows to support non-serializable values, unfortunately it drops all shrinking. capabilities.
```
