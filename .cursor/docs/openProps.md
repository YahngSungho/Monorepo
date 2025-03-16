```css
/* stylelint-disable */
:where(html) {
	--font-weight-1: 100;
	--font-weight-2: 200;
	--font-weight-3: 300;
	--font-weight-4: 400;
	--font-weight-5: 500;
	--font-weight-6: 600;
	--font-weight-7: 700;
	--font-weight-8: 800;
	--font-weight-9: 900;
	--font-lineheight-00: 0.95;
	--font-lineheight-0: 1.1;
	--font-lineheight-1: 1.25;
	--font-lineheight-2: 1.375;
	--font-lineheight-3: 1.5;
	--font-lineheight-4: 1.75;
	--font-lineheight-5: 2;
	--font-letterspacing-0: -0.05em;
	--font-letterspacing-1: 0.025em;
	--font-letterspacing-2: 0.05em;
	--font-letterspacing-3: 0.075em;
	--font-letterspacing-4: 0.15em;
	--font-letterspacing-5: 0.5em;
	--font-letterspacing-6: 0.75em;
	--font-letterspacing-7: 1em;
	--font-size-00: 0.5rem;
	--font-size-0: 0.75rem;
	--font-size-1: 1rem;
	--font-size-2: 1.1rem;
	--font-size-3: 1.25rem;
	--font-size-4: 1.5rem;
	--font-size-5: 2rem;
	--font-size-6: 2.5rem;
	--font-size-7: 3rem;
	--font-size-8: 3.5rem;
	--font-size-fluid-0: clamp(0.75rem, 2vi, 1rem);
	--font-size-fluid-1: clamp(1rem, 4vi, 1.5rem);
	--font-size-fluid-2: clamp(1.5rem, 6vi, 2.5rem);
	--font-size-fluid-3: clamp(2rem, 9vi, 3.5rem);
	--size-000: -0.5rem;
	--size-00: -0.25rem;
	--size-1: 0.25rem;
	--size-2: 0.5rem;
	--size-3: 1rem;
	--size-4: 1.25rem;
	--size-5: 1.5rem;
	--size-6: 1.75rem;
	--size-7: 2rem;
	--size-8: 3rem;
	--size-9: 4rem;
	--size-10: 5rem;
	--size-11: 7.5rem;
	--size-12: 10rem;
	--size-13: 15rem;
	--size-14: 20rem;
	--size-15: 30rem;
	--size-px-000: -8px;
	--size-px-00: -4px;
	--size-px-1: 4px;
	--size-px-2: 8px;
	--size-px-3: 16px;
	--size-px-4: 20px;
	--size-px-5: 24px;
	--size-px-6: 28px;
	--size-px-7: 32px;
	--size-px-8: 48px;
	--size-px-9: 64px;
	--size-px-10: 80px;
	--size-px-11: 120px;
	--size-px-12: 160px;
	--size-px-13: 240px;
	--size-px-14: 320px;
	--size-px-15: 480px;
	--size-fluid-1: clamp(0.5rem, 1vi, 1rem);
	--size-fluid-2: clamp(1rem, 2vi, 1.5rem);
	--size-fluid-3: clamp(1.5rem, 3vi, 2rem);
	--size-fluid-4: clamp(2rem, 4vi, 3rem);
	--size-fluid-5: clamp(4rem, 5vi, 5rem);
	--size-fluid-6: clamp(5rem, 7vi, 7.5rem);
	--size-fluid-7: clamp(7.5rem, 10vi, 10rem);
	--size-fluid-8: clamp(10rem, 20vi, 15rem);
	--size-fluid-9: clamp(15rem, 30vi, 20rem);
	--size-fluid-10: clamp(20rem, 40vi, 30rem);
	--size-content-1: 20ch;
	--size-content-2: 45ch;
	--size-content-3: 60ch;
	--size-header-1: 20ch;
	--size-header-2: 25ch;
	--size-header-3: 35ch;
	--size-xxs: 240px;
	--size-xs: 360px;
	--size-sm: 480px;
	--size-md: 768px;
	--size-lg: 1024px;
	--size-xl: 1440px;
	--size-xxl: 1920px;
	--size-relative-000: -0.5ch;
	--size-relative-00: -0.25ch;
	--size-relative-1: 0.25ch;
	--size-relative-2: 0.5ch;
	--size-relative-3: 1ch;
	--size-relative-4: 1.25ch;
	--size-relative-5: 1.5ch;
	--size-relative-6: 1.75ch;
	--size-relative-7: 2ch;
	--size-relative-8: 3ch;
	--size-relative-9: 4ch;
	--size-relative-10: 5ch;
	--size-relative-11: 7.5ch;
	--size-relative-12: 10ch;
	--size-relative-13: 15ch;
	--size-relative-14: 20ch;
	--size-relative-15: 30ch;
	--ease-1: cubic-bezier(0.25, 0, 0.5, 1);
	--ease-2: cubic-bezier(0.25, 0, 0.4, 1);
	--ease-3: cubic-bezier(0.25, 0, 0.3, 1);
	--ease-4: cubic-bezier(0.25, 0, 0.2, 1);
	--ease-5: cubic-bezier(0.25, 0, 0.1, 1);
	--ease-in-1: cubic-bezier(0.25, 0, 1, 1);
	--ease-in-2: cubic-bezier(0.5, 0, 1, 1);
	--ease-in-3: cubic-bezier(0.7, 0, 1, 1);
	--ease-in-4: cubic-bezier(0.9, 0, 1, 1);
	--ease-in-5: cubic-bezier(1, 0, 1, 1);
	--ease-out-1: cubic-bezier(0, 0, 0.75, 1);
	--ease-out-2: cubic-bezier(0, 0, 0.5, 1);
	--ease-out-3: cubic-bezier(0, 0, 0.3, 1);
	--ease-out-4: cubic-bezier(0, 0, 0.1, 1);
	--ease-out-5: cubic-bezier(0, 0, 0, 1);
	--ease-in-out-1: cubic-bezier(0.1, 0, 0.9, 1);
	--ease-in-out-2: cubic-bezier(0.3, 0, 0.7, 1);
	--ease-in-out-3: cubic-bezier(0.5, 0, 0.5, 1);
	--ease-in-out-4: cubic-bezier(0.7, 0, 0.3, 1);
	--ease-in-out-5: cubic-bezier(0.9, 0, 0.1, 1);
	--ease-elastic-out-1: cubic-bezier(0.5, 0.75, 0.75, 1.25);
	--ease-elastic-out-2: cubic-bezier(0.5, 1, 0.75, 1.25);
	--ease-elastic-out-3: cubic-bezier(0.5, 1.25, 0.75, 1.25);
	--ease-elastic-out-4: cubic-bezier(0.5, 1.5, 0.75, 1.25);
	--ease-elastic-out-5: cubic-bezier(0.5, 1.75, 0.75, 1.25);
	--ease-elastic-in-1: cubic-bezier(0.5, -0.25, 0.75, 1);
	--ease-elastic-in-2: cubic-bezier(0.5, -0.5, 0.75, 1);
	--ease-elastic-in-3: cubic-bezier(0.5, -0.75, 0.75, 1);
	--ease-elastic-in-4: cubic-bezier(0.5, -1, 0.75, 1);
	--ease-elastic-in-5: cubic-bezier(0.5, -1.25, 0.75, 1);
	--ease-elastic-in-out-1: cubic-bezier(0.5, -0.1, 0.1, 1.5);
	--ease-elastic-in-out-2: cubic-bezier(0.5, -0.3, 0.1, 1.5);
	--ease-elastic-in-out-3: cubic-bezier(0.5, -0.5, 0.1, 1.5);
	--ease-elastic-in-out-4: cubic-bezier(0.5, -0.7, 0.1, 1.5);
	--ease-elastic-in-out-5: cubic-bezier(0.5, -0.9, 0.1, 1.5);
	--ease-step-1: steps(2);
	--ease-step-2: steps(3);
	--ease-step-3: steps(4);
	--ease-step-4: steps(7);
	--ease-step-5: steps(10);
	--ease-elastic-1: var(--ease-elastic-out-1);
	--ease-elastic-2: var(--ease-elastic-out-2);
	--ease-elastic-3: var(--ease-elastic-out-3);
	--ease-elastic-4: var(--ease-elastic-out-4);
	--ease-elastic-5: var(--ease-elastic-out-5);
	--ease-squish-1: var(--ease-elastic-in-out-1);
	--ease-squish-2: var(--ease-elastic-in-out-2);
	--ease-squish-3: var(--ease-elastic-in-out-3);
	--ease-squish-4: var(--ease-elastic-in-out-4);
	--ease-squish-5: var(--ease-elastic-in-out-5);
	--ease-spring-1: linear(
		0,
		0.006,
		0.025 2.8%,
		0.101 6.1%,
		0.539 18.9%,
		0.721 25.3%,
		0.849 31.5%,
		0.937 38.1%,
		0.968 41.8%,
		0.991 45.7%,
		1.006 50.1%,
		1.015 55%,
		1.017 63.9%,
		1.001
	);
	--ease-spring-2: linear(
		0,
		0.007,
		0.029 2.2%,
		0.118 4.7%,
		0.625 14.4%,
		0.826 19%,
		0.902,
		0.962,
		1.008 26.1%,
		1.041 28.7%,
		1.064 32.1%,
		1.07 36%,
		1.061 40.5%,
		1.015 53.4%,
		0.999 61.6%,
		0.995 71.2%,
		1
	);
	--ease-spring-3: linear(
		0,
		0.009,
		0.035 2.1%,
		0.141 4.4%,
		0.723 12.9%,
		0.938 16.7%,
		1.017,
		1.077,
		1.121,
		1.149 24.3%,
		1.159,
		1.163,
		1.161,
		1.154 29.9%,
		1.129 32.8%,
		1.051 39.6%,
		1.017 43.1%,
		0.991,
		0.977 51%,
		0.974 53.8%,
		0.975 57.1%,
		0.997 69.8%,
		1.003 76.9%,
		1
	);
	--ease-spring-4: linear(
		0,
		0.009,
		0.037 1.7%,
		0.153 3.6%,
		0.776 10.3%,
		1.001,
		1.142 16%,
		1.185,
		1.209 19%,
		1.215 19.9% 20.8%,
		1.199,
		1.165 25%,
		1.056 30.3%,
		1.008 33%,
		0.973,
		0.955 39.2%,
		0.953 41.1%,
		0.957 43.3%,
		0.998 53.3%,
		1.009 59.1% 63.7%,
		0.998 78.9%,
		1
	);
	--ease-spring-5: linear(
		0,
		0.01,
		0.04 1.6%,
		0.161 3.3%,
		0.816 9.4%,
		1.046,
		1.189 14.4%,
		1.231,
		1.254 17%,
		1.259,
		1.257 18.6%,
		1.236,
		1.194 22.3%,
		1.057 27%,
		0.999 29.4%,
		0.955 32.1%,
		0.942,
		0.935 34.9%,
		0.933,
		0.939 38.4%,
		1 47.3%,
		1.011,
		1.017 52.6%,
		1.016 56.4%,
		1 65.2%,
		0.996 70.2%,
		1.001 87.2%,
		1
	);
	--ease-bounce-1: linear(
		0,
		0.004,
		0.016,
		0.035,
		0.063,
		0.098,
		0.141,
		0.191,
		0.25,
		0.316,
		0.391 36.8%,
		0.563,
		0.766,
		1 58.8%,
		0.946,
		0.908 69.1%,
		0.895,
		0.885,
		0.879,
		0.878,
		0.879,
		0.885,
		0.895,
		0.908 89.7%,
		0.946,
		1
	);
	--ease-bounce-2: linear(
		0,
		0.004,
		0.016,
		0.035,
		0.063,
		0.098,
		0.141 15.1%,
		0.25,
		0.391,
		0.562,
		0.765,
		1,
		0.892 45.2%,
		0.849,
		0.815,
		0.788,
		0.769,
		0.757,
		0.753,
		0.757,
		0.769,
		0.788,
		0.815,
		0.85,
		0.892 75.2%,
		1 80.2%,
		0.973,
		0.954,
		0.943,
		0.939,
		0.943,
		0.954,
		0.973,
		1
	);
	--ease-bounce-3: linear(
		0,
		0.004,
		0.016,
		0.035,
		0.062,
		0.098,
		0.141 11.4%,
		0.25,
		0.39,
		0.562,
		0.764,
		1 30.3%,
		0.847 34.8%,
		0.787,
		0.737,
		0.699,
		0.672,
		0.655,
		0.65,
		0.656,
		0.672,
		0.699,
		0.738,
		0.787,
		0.847 61.7%,
		1 66.2%,
		0.946,
		0.908,
		0.885 74.2%,
		0.879,
		0.878,
		0.879,
		0.885 79.5%,
		0.908,
		0.946,
		1 87.4%,
		0.981,
		0.968,
		0.96,
		0.957,
		0.96,
		0.968,
		0.981,
		1
	);
	--ease-bounce-4: linear(
		0,
		0.004,
		0.016 3%,
		0.062,
		0.141,
		0.25,
		0.391,
		0.562 18.2%,
		1 24.3%,
		0.81,
		0.676 32.3%,
		0.629,
		0.595,
		0.575,
		0.568,
		0.575,
		0.595,
		0.629,
		0.676 48.2%,
		0.811,
		1 56.2%,
		0.918,
		0.86,
		0.825,
		0.814,
		0.825,
		0.86,
		0.918,
		1 77.2%,
		0.94 80.6%,
		0.925,
		0.92,
		0.925,
		0.94 87.5%,
		1 90.9%,
		0.974,
		0.965,
		0.974,
		1
	);
	--ease-bounce-5: linear(
		0,
		0.004,
		0.016 2.5%,
		0.063,
		0.141,
		0.25 10.1%,
		0.562,
		1 20.2%,
		0.783,
		0.627,
		0.534 30.9%,
		0.511,
		0.503,
		0.511,
		0.534 38%,
		0.627,
		0.782,
		1 48.7%,
		0.892,
		0.815,
		0.769 56.3%,
		0.757,
		0.753,
		0.757,
		0.769 61.3%,
		0.815,
		0.892,
		1 68.8%,
		0.908 72.4%,
		0.885,
		0.878,
		0.885,
		0.908 79.4%,
		1 83%,
		0.954 85.5%,
		0.943,
		0.939,
		0.943,
		0.954 90.5%,
		1 93%,
		0.977,
		0.97,
		0.977,
		1
	);
	--layer-1: 1;
	--layer-2: 2;
	--layer-3: 3;
	--layer-4: 4;
	--layer-5: 5;
	--layer-important: 2147483647;
	--shadow-color: 220 3% 15%;
	--shadow-strength: 1%;
	--inner-shadow-highlight:
		inset 0 -0.5px 0 0 rgb(255 255 255), inset 0 0.5px 0 0 rgb(0 0 0 / 6.7%);
	--shadow-1: 0 1px 2px -1px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%));
	--shadow-2:
		0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 7px 14px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%));
	--shadow-3:
		0 -1px 3px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)),
		0 1px 2px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)),
		0 2px 5px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)),
		0 4px 12px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)),
		0 12px 15px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));
	--shadow-4:
		0 -2px 5px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)),
		0 1px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 2px 2px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)),
		0 9px 9px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)),
		0 16px 16px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 6%));
	--shadow-5:
		0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)),
		0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)),
		0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)),
		0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));
	--shadow-6:
		0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)),
		0 3px 2px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 7px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
		0 12px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)),
		0 22px 18px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)),
		0 41px 33px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 6%)),
		0 100px 80px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));
	--inner-shadow-0: inset 0 0 0 1px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%));
	--inner-shadow-1:
		inset 0 1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
		var(--inner-shadow-highlight);
	--inner-shadow-2:
		inset 0 1px 4px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
		var(--inner-shadow-highlight);
	--inner-shadow-3:
		inset 0 2px 8px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
		var(--inner-shadow-highlight);
	--inner-shadow-4:
		inset 0 2px 14px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
		var(--inner-shadow-highlight);
	--ratio-square: 1;
	--ratio-landscape: 4/3;
	--ratio-portrait: 3/4;
	--ratio-widescreen: 16/9;
	--ratio-ultrawide: 18/5;
	--ratio-golden: 1.618/1;
	--gray-0: rgb(248 249 250);
	--gray-1: rgb(241 243 245);
	--gray-2: rgb(233 236 239);
	--gray-3: rgb(222 226 230);
	--gray-4: rgb(206 212 218);
	--gray-5: rgb(173 181 189);
	--gray-6: rgb(134 142 150);
	--gray-7: rgb(73 80 87);
	--gray-8: rgb(52 58 64);
	--gray-9: rgb(33 37 41);
	--gray-10: rgb(22 25 29);
	--gray-11: rgb(13 15 18);
	--gray-12: rgb(3 5 7);
	--stone-0: rgb(248 250 251);
	--stone-1: rgb(242 244 246);
	--stone-2: rgb(235 237 239);
	--stone-3: rgb(224 228 229);
	--stone-4: rgb(209 214 216);
	--stone-5: rgb(177 182 185);
	--stone-6: rgb(151 155 157);
	--stone-7: rgb(126 130 130);
	--stone-8: rgb(102 105 104);
	--stone-9: rgb(80 81 79);
	--stone-10: rgb(58 58 55);
	--stone-11: rgb(37 37 33);
	--stone-12: rgb(18 18 16);
	--red-0: rgb(255 245 245);
	--red-1: rgb(255 227 227);
	--red-2: rgb(255 201 201);
	--red-3: rgb(255 168 168);
	--red-4: rgb(255 135 135);
	--red-5: rgb(255 107 107);
	--red-6: rgb(250 82 82);
	--red-7: rgb(240 62 62);
	--red-8: rgb(224 49 49);
	--red-9: rgb(201 42 42);
	--red-10: rgb(176 37 37);
	--red-11: rgb(150 32 32);
	--red-12: rgb(125 26 26);
	--pink-0: rgb(255 240 246);
	--pink-1: rgb(255 222 235);
	--pink-2: rgb(252 194 215);
	--pink-3: rgb(250 162 193);
	--pink-4: rgb(247 131 172);
	--pink-5: rgb(240 101 149);
	--pink-6: rgb(230 73 128);
	--pink-7: rgb(214 51 108);
	--pink-8: rgb(194 37 92);
	--pink-9: rgb(166 30 77);
	--pink-10: rgb(140 25 65);
	--pink-11: rgb(115 21 54);
	--pink-12: rgb(89 16 42);
	--purple-0: rgb(248 240 252);
	--purple-1: rgb(243 217 250);
	--purple-2: rgb(238 190 250);
	--purple-3: rgb(229 153 247);
	--purple-4: rgb(218 119 242);
	--purple-5: rgb(204 93 232);
	--purple-6: rgb(190 75 219);
	--purple-7: rgb(174 62 201);
	--purple-8: rgb(156 54 181);
	--purple-9: rgb(134 46 156);
	--purple-10: rgb(112 38 130);
	--purple-11: rgb(90 30 105);
	--purple-12: rgb(68 23 79);
	--violet-0: rgb(243 240 255);
	--violet-1: rgb(229 219 255);
	--violet-2: rgb(208 191 255);
	--violet-3: rgb(177 151 252);
	--violet-4: rgb(151 117 250);
	--violet-5: rgb(132 94 247);
	--violet-6: rgb(121 80 242);
	--violet-7: rgb(112 72 232);
	--violet-8: rgb(103 65 217);
	--violet-9: rgb(95 61 196);
	--violet-10: rgb(82 53 171);
	--violet-11: rgb(70 45 145);
	--violet-12: rgb(58 37 120);
	--indigo-0: rgb(237 242 255);
	--indigo-1: rgb(219 228 255);
	--indigo-2: rgb(186 200 255);
	--indigo-3: rgb(145 167 255);
	--indigo-4: rgb(116 143 252);
	--indigo-5: rgb(92 124 250);
	--indigo-6: rgb(76 110 245);
	--indigo-7: rgb(66 99 235);
	--indigo-8: rgb(59 91 219);
	--indigo-9: rgb(54 79 199);
	--indigo-10: rgb(47 68 173);
	--indigo-11: rgb(40 58 148);
	--indigo-12: rgb(33 48 122);
	--blue-0: rgb(231 245 255);
	--blue-1: rgb(208 235 255);
	--blue-2: rgb(165 216 255);
	--blue-3: rgb(116 192 252);
	--blue-4: rgb(77 171 247);
	--blue-5: rgb(51 154 240);
	--blue-6: rgb(34 139 230);
	--blue-7: rgb(28 126 214);
	--blue-8: rgb(25 113 194);
	--blue-9: rgb(24 100 171);
	--blue-10: rgb(20 85 145);
	--blue-11: rgb(17 70 120);
	--blue-12: rgb(13 55 94);
	--cyan-0: rgb(227 250 252);
	--cyan-1: rgb(197 246 250);
	--cyan-2: rgb(153 233 242);
	--cyan-3: rgb(102 217 232);
	--cyan-4: rgb(59 201 219);
	--cyan-5: rgb(34 184 207);
	--cyan-6: rgb(21 170 191);
	--cyan-7: rgb(16 152 173);
	--cyan-8: rgb(12 133 153);
	--cyan-9: rgb(11 114 133);
	--cyan-10: rgb(9 92 107);
	--cyan-11: rgb(7 70 82);
	--cyan-12: rgb(5 48 56);
	--teal-0: rgb(230 252 245);
	--teal-1: rgb(195 250 232);
	--teal-2: rgb(150 242 215);
	--teal-3: rgb(99 230 190);
	--teal-4: rgb(56 217 169);
	--teal-5: rgb(32 201 151);
	--teal-6: rgb(18 184 134);
	--teal-7: rgb(12 166 120);
	--teal-8: rgb(9 146 104);
	--teal-9: rgb(8 127 91);
	--teal-10: rgb(6 102 73);
	--teal-11: rgb(5 77 55);
	--teal-12: rgb(3 51 37);
	--green-0: rgb(235 251 238);
	--green-1: rgb(211 249 216);
	--green-2: rgb(178 242 187);
	--green-3: rgb(140 233 154);
	--green-4: rgb(105 219 124);
	--green-5: rgb(81 207 102);
	--green-6: rgb(64 192 87);
	--green-7: rgb(55 178 77);
	--green-8: rgb(47 158 68);
	--green-9: rgb(43 138 62);
	--green-10: rgb(35 112 50);
	--green-11: rgb(27 87 39);
	--green-12: rgb(19 61 27);
	--lime-0: rgb(244 252 227);
	--lime-1: rgb(233 250 200);
	--lime-2: rgb(216 245 162);
	--lime-3: rgb(192 235 117);
	--lime-4: rgb(169 227 75);
	--lime-5: rgb(148 216 45);
	--lime-6: rgb(130 201 30);
	--lime-7: rgb(116 184 22);
	--lime-8: rgb(102 168 15);
	--lime-9: rgb(92 148 13);
	--lime-10: rgb(76 122 11);
	--lime-11: rgb(60 97 9);
	--lime-12: rgb(44 71 6);
	--yellow-0: rgb(255 249 219);
	--yellow-1: rgb(255 243 191);
	--yellow-2: rgb(255 236 153);
	--yellow-3: rgb(255 224 102);
	--yellow-4: rgb(255 212 59);
	--yellow-5: rgb(252 196 25);
	--yellow-6: rgb(250 176 5);
	--yellow-7: rgb(245 159 0);
	--yellow-8: rgb(240 140 0);
	--yellow-9: rgb(230 119 0);
	--yellow-10: rgb(179 92 0);
	--yellow-11: rgb(128 66 0);
	--yellow-12: rgb(102 53 0);
	--orange-0: rgb(255 244 230);
	--orange-1: rgb(255 232 204);
	--orange-2: rgb(255 216 168);
	--orange-3: rgb(255 192 120);
	--orange-4: rgb(255 169 77);
	--orange-5: rgb(255 146 43);
	--orange-6: rgb(253 126 20);
	--orange-7: rgb(247 103 7);
	--orange-8: rgb(232 89 12);
	--orange-9: rgb(217 72 15);
	--orange-10: rgb(191 64 13);
	--orange-11: rgb(153 51 11);
	--orange-12: rgb(128 43 9);
	--choco-0: rgb(255 248 220);
	--choco-1: rgb(252 225 188);
	--choco-2: rgb(247 202 158);
	--choco-3: rgb(241 178 128);
	--choco-4: rgb(233 155 98);
	--choco-5: rgb(223 133 69);
	--choco-6: rgb(212 110 37);
	--choco-7: rgb(189 95 27);
	--choco-8: rgb(164 81 23);
	--choco-9: rgb(138 69 19);
	--choco-10: rgb(112 58 19);
	--choco-11: rgb(87 47 18);
	--choco-12: rgb(61 33 13);
	--brown-0: rgb(250 244 235);
	--brown-1: rgb(237 224 209);
	--brown-2: rgb(224 202 183);
	--brown-3: rgb(211 183 158);
	--brown-4: rgb(197 162 133);
	--brown-5: rgb(183 143 109);
	--brown-6: rgb(168 124 86);
	--brown-7: rgb(149 107 71);
	--brown-8: rgb(130 91 58);
	--brown-9: rgb(111 75 45);
	--brown-10: rgb(94 58 33);
	--brown-11: rgb(78 43 21);
	--brown-12: rgb(66 36 18);
	--sand-0: rgb(248 250 251);
	--sand-1: rgb(230 228 220);
	--sand-2: rgb(213 207 189);
	--sand-3: rgb(194 185 160);
	--sand-4: rgb(174 165 140);
	--sand-5: rgb(154 145 120);
	--sand-6: rgb(134 124 101);
	--sand-7: rgb(115 106 83);
	--sand-8: rgb(95 87 70);
	--sand-9: rgb(75 70 57);
	--sand-10: rgb(56 53 45);
	--sand-11: rgb(37 37 33);
	--sand-12: rgb(18 18 16);
	--camo-0: rgb(249 251 231);
	--camo-1: rgb(232 237 156);
	--camo-2: rgb(210 223 78);
	--camo-3: rgb(194 206 52);
	--camo-4: rgb(181 187 46);
	--camo-5: rgb(167 168 39);
	--camo-6: rgb(153 150 33);
	--camo-7: rgb(140 133 28);
	--camo-8: rgb(126 116 22);
	--camo-9: rgb(109 100 20);
	--camo-10: rgb(93 84 17);
	--camo-11: rgb(77 70 14);
	--camo-12: rgb(54 48 10);
	--jungle-0: rgb(236 254 176);
	--jungle-1: rgb(222 243 154);
	--jungle-2: rgb(208 232 132);
	--jungle-3: rgb(194 221 110);
	--jungle-4: rgb(181 209 91);
	--jungle-5: rgb(168 198 72);
	--jungle-6: rgb(155 187 54);
	--jungle-7: rgb(143 176 36);
	--jungle-8: rgb(132 165 19);
	--jungle-9: rgb(122 153 8);
	--jungle-10: rgb(101 128 6);
	--jungle-11: rgb(81 102 5);
	--jungle-12: rgb(61 77 4);
	--gradient-1: linear-gradient(
		to bottom right,
		rgb(31 0 92),
		rgb(91 0 96),
		rgb(135 1 96),
		rgb(172 37 94),
		rgb(202 72 92),
		rgb(225 107 92),
		rgb(243 144 96),
		rgb(255 181 107)
	);
	--gradient-2: linear-gradient(to bottom right, rgb(72 0 92), rgb(131 0 226), rgb(162 105 255));
	--gradient-3:
		radial-gradient(circle at top right, rgb(0 255 255), rgb(0 255 255 / 0%)),
		radial-gradient(circle at bottom left, rgb(255 20 146), rgb(255 20 146 / 0%));
	--gradient-4: linear-gradient(to bottom right, rgb(0 245 160), rgb(0 217 245));
	--gradient-5: conic-gradient(from -270deg at 75% 110%, rgb(255 0 255), rgb(255 250 240));
	--gradient-6: conic-gradient(from -90deg at top left, rgb(0 0 0), rgb(255 255 255));
	--gradient-7: linear-gradient(to bottom right, rgb(114 198 239), rgb(0 78 143));
	--gradient-8: conic-gradient(
		from 90deg at 50% 0%,
		rgb(17 17 17),
		50%,
		rgb(34 34 34),
		rgb(17 17 17)
	);
	--gradient-9: conic-gradient(from 0.5turn at bottom center, rgb(173 216 230), rgb(255 255 255));
	--gradient-10: conic-gradient(
		from 90deg at 40% -25%,
		gold,
		rgb(247 157 3),
		rgb(238 105 7),
		rgb(230 57 10),
		rgb(222 13 13),
		rgb(214 16 57),
		rgb(207 18 97),
		rgb(199 21 133),
		rgb(207 18 97),
		rgb(214 16 57),
		rgb(222 13 13),
		rgb(238 105 7),
		rgb(247 157 3),
		gold,
		gold,
		gold
	);
	--gradient-11: conic-gradient(at bottom left, rgb(255 20 147), cyan);
	--gradient-12: conic-gradient(
		from 90deg at 25% -10%,
		rgb(255 69 0),
		rgb(211 243 64),
		rgb(123 238 133),
		rgb(175 238 238),
		rgb(123 238 133)
	);
	--gradient-13: radial-gradient(
		circle at 50% 200%,
		rgb(0 1 66),
		rgb(59 0 131),
		rgb(179 0 195),
		rgb(255 5 159),
		rgb(255 70 97),
		rgb(255 173 134),
		rgb(255 243 199)
	);
	--gradient-14: conic-gradient(at top right, lime, cyan);
	--gradient-15: linear-gradient(
		to bottom right,
		rgb(199 210 254),
		rgb(254 202 202),
		rgb(254 243 199)
	);
	--gradient-16: radial-gradient(circle at 50% -250%, rgb(55 65 81), rgb(17 24 39), rgb(0 0 0));
	--gradient-17: conic-gradient(from -90deg at 50% -25%, blue, rgb(138 43 226));
	--gradient-18:
		linear-gradient(0deg, rgb(255 0 0 / 80%), rgb(255 0 0 / 0%) 75%),
		linear-gradient(60deg, rgb(255 255 0 / 80%), rgb(255 255 0 / 0%) 75%),
		linear-gradient(120deg, rgb(0 255 0 / 80%), rgb(0 255 0 / 0%) 75%),
		linear-gradient(180deg, rgb(0 255 255 / 80%), rgb(0 255 255 / 0%) 75%),
		linear-gradient(240deg, rgb(0 0 255 / 80%), rgb(0 0 255 / 0%) 75%),
		linear-gradient(300deg, rgb(255 0 255 / 80%), rgb(255 0 255 / 0%) 75%);
	--gradient-19: linear-gradient(to bottom right, rgb(255 226 89), rgb(255 167 81));
	--gradient-20: conic-gradient(
		from -135deg at -10% center,
		orange,
		rgb(255 119 21),
		rgb(255 82 42),
		rgb(255 63 71),
		rgb(255 84 130),
		rgb(255 105 180)
	);
	--gradient-21: conic-gradient(
		from -90deg at 25% 115%,
		red,
		rgb(255 0 102),
		rgb(255 0 204),
		rgb(204 0 255),
		rgb(102 0 255),
		rgb(0 0 255),
		rgb(0 0 255),
		rgb(0 0 255),
		rgb(0 0 255)
	);
	--gradient-22: linear-gradient(to bottom right, rgb(172 182 229), rgb(134 253 232));
	--gradient-23: linear-gradient(to bottom right, rgb(83 105 118), rgb(41 46 73));
	--gradient-24: conic-gradient(
		from 0.5turn at 0% 0%,
		rgb(0 196 118),
		10%,
		rgb(130 176 255),
		90%,
		rgb(0 196 118)
	);
	--gradient-25: conic-gradient(
		at 125% 50%,
		rgb(183 140 247),
		rgb(255 124 148),
		rgb(255 207 13),
		rgb(255 124 148),
		rgb(183 140 247)
	);
	--gradient-26: linear-gradient(to bottom right, rgb(151 150 240), rgb(251 199 212));
	--gradient-27: conic-gradient(from 0.5turn at bottom left, rgb(255 20 147), rgb(102 51 153));
	--gradient-28: conic-gradient(from -90deg at 50% 105%, rgb(255 255 255), orchid);
	--gradient-29:
		radial-gradient(circle at top right, rgb(191 179 255), rgb(191 179 255 / 0%)),
		radial-gradient(circle at bottom left, rgb(134 172 249), rgb(134 172 249 / 0%));
	--gradient-30:
		radial-gradient(circle at top right, rgb(0 255 128), rgb(0 255 128 / 0%)),
		radial-gradient(circle at bottom left, rgb(173 255 214), rgb(173 255 214 / 0%));
	--noise-1: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.005' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	--noise-2: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.05' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	--noise-3: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.25' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	--noise-4: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 2056 2056' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	--noise-5: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 2056 2056' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	--noise-filter-1: contrast(300%) brightness(100%);
	--noise-filter-2: contrast(200%) brightness(150%);
	--noise-filter-3: contrast(200%) brightness(250%);
	--noise-filter-4: contrast(200%) brightness(500%);
	--noise-filter-5: contrast(200%) brightness(1000%);
	--animation-fade-in: fade-in 0.5s var(--ease-3);
	--animation-fade-in-bloom: fade-in-bloom 2s var(--ease-3);
	--animation-fade-out: fade-out 0.5s var(--ease-3);
	--animation-fade-out-bloom: fade-out-bloom 2s var(--ease-3);
	--animation-scale-up: scale-up 0.5s var(--ease-3);
	--animation-scale-down: scale-down 0.5s var(--ease-3);
	--animation-slide-out-up: slide-out-up 0.5s var(--ease-3);
	--animation-slide-out-down: slide-out-down 0.5s var(--ease-3);
	--animation-slide-out-right: slide-out-right 0.5s var(--ease-3);
	--animation-slide-out-left: slide-out-left 0.5s var(--ease-3);
	--animation-slide-in-up: slide-in-up 0.5s var(--ease-3);
	--animation-slide-in-down: slide-in-down 0.5s var(--ease-3);
	--animation-slide-in-right: slide-in-right 0.5s var(--ease-3);
	--animation-slide-in-left: slide-in-left 0.5s var(--ease-3);
	--animation-shake-x: shake-x 0.75s var(--ease-out-5);
	--animation-shake-y: shake-y 0.75s var(--ease-out-5);
	--animation-shake-z: shake-z 1s var(--ease-in-out-3);
	--animation-spin: spin 2s linear infinite;
	--animation-ping: ping 5s var(--ease-out-3) infinite;
	--animation-blink: blink 1s var(--ease-out-3) infinite;
	--animation-float: float 3s var(--ease-in-out-3) infinite;
	--animation-bounce: bounce 2s var(--ease-squish-2) infinite;
	--animation-pulse: pulse 2s var(--ease-out-3) infinite;
	--border-size-1: 1px;
	--border-size-2: 2px;
	--border-size-3: 5px;
	--border-size-4: 10px;
	--border-size-5: 25px;
	--radius-1: 2px;
	--radius-2: 5px;
	--radius-3: 1rem;
	--radius-4: 2rem;
	--radius-5: 4rem;
	--radius-6: 8rem;
	--radius-drawn-1: 255px 15px 225px 15px/15px 225px 15px 255px;
	--radius-drawn-2: 125px 10px 20px 185px/25px 205px 205px 25px;
	--radius-drawn-3: 15px 255px 15px 225px/225px 15px 255px 15px;
	--radius-drawn-4: 15px 25px 155px 25px/225px 150px 25px 115px;
	--radius-drawn-5: 250px 25px 15px 20px/15px 80px 105px 115px;
	--radius-drawn-6: 28px 100px 20px 15px/150px 30px 205px 225px;
	--radius-round: 1e5px;
	--radius-blob-1: 30% 70% 70% 30%/53% 30% 70% 47%;
	--radius-blob-2: 53% 47% 34% 66%/63% 46% 54% 37%;
	--radius-blob-3: 37% 63% 56% 44%/49% 56% 44% 51%;
	--radius-blob-4: 63% 37% 37% 63%/43% 37% 63% 57%;
	--radius-blob-5: 49% 51% 48% 52%/57% 44% 56% 43%;
	--radius-conditional-1: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-1));
	--radius-conditional-2: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-2));
	--radius-conditional-3: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-3));
	--radius-conditional-4: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-4));
	--radius-conditional-5: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-5));
	--radius-conditional-6: clamp(0px, calc(100vi - 100%) * 1e5, var(--radius-6));

	@media (prefers-color-scheme: dark) {
		--shadow-color: 220 40% 2%;
		--shadow-strength: 25%;
		--inner-shadow-highlight:
			inset 0 -0.5px 0 0 hsl(0deg 0% 100% / 6.7%), inset 0 0.5px 0 0 rgb(0 0 0 / 46.7%);
	}
}

@keyframes fade-in {
	to {
		opacity: 1;
	}
}

@keyframes fade-in-bloom {
	0% {
		opacity: 0;
		filter: brightness(1) blur(20px);
	}
	10% {
		opacity: 1;
		filter: brightness(2) blur(10px);
	}
	100% {
		opacity: 1;
		filter: brightness(1) blur(0);
	}
}

@keyframes fade-out {
	to {
		opacity: 0;
	}
}

@keyframes fade-out-bloom {
	100% {
		opacity: 0;
		filter: brightness(1) blur(20px);
	}
	10% {
		opacity: 1;
		filter: brightness(2) blur(10px);
	}
	0% {
		opacity: 1;
		filter: brightness(1) blur(0);
	}
}

@keyframes scale-up {
	to {
		transform: scale(1.25);
	}
}

@keyframes scale-down {
	to {
		transform: scale(0.75);
	}
}

@keyframes slide-out-up {
	to {
		transform: translateY(-100%);
	}
}

@keyframes slide-out-down {
	to {
		transform: translateY(100%);
	}
}

@keyframes slide-out-right {
	to {
		transform: translateX(100%);
	}
}

@keyframes slide-out-left {
	to {
		transform: translateX(-100%);
	}
}

@keyframes slide-in-up {
	0% {
		transform: translateY(100%);
	}
}

@keyframes slide-in-down {
	0% {
		transform: translateY(-100%);
	}
}

@keyframes slide-in-right {
	0% {
		transform: translateX(-100%);
	}
}

@keyframes slide-in-left {
	0% {
		transform: translateX(100%);
	}
}

@keyframes shake-x {
	0%,
	100% {
		transform: translateX(0);
	}
	20% {
		transform: translateX(-5%);
	}
	40% {
		transform: translateX(5%);
	}
	60% {
		transform: translateX(-5%);
	}
	80% {
		transform: translateX(5%);
	}
}

@keyframes shake-y {
	0%,
	100% {
		transform: translateY(0);
	}
	20% {
		transform: translateY(-5%);
	}
	40% {
		transform: translateY(5%);
	}
	60% {
		transform: translateY(-5%);
	}
	80% {
		transform: translateY(5%);
	}
}

@keyframes shake-z {
	0%,
	100% {
		transform: rotate(0deg);
	}
	20% {
		transform: rotate(-2deg);
	}
	40% {
		transform: rotate(2deg);
	}
	60% {
		transform: rotate(-2deg);
	}
	80% {
		transform: rotate(2deg);
	}
}

@keyframes spin {
	to {
		transform: rotate(1turn);
	}
}

@keyframes ping {
	90%,
	100% {
		transform: scale(2);
		opacity: 0;
	}
}

@keyframes blink {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

@keyframes float {
	50% {
		transform: translateY(-25%);
	}
}

@keyframes bounce {
	25% {
		transform: translateY(-20%);
	}
	40% {
		transform: translateY(-3%);
	}

	0%,
	60%,
	100% {
		transform: translateY(0);
	}
}

@keyframes pulse {
	50% {
		transform: scale(0.9);
	}
}

@media (prefers-color-scheme: dark) {
	@keyframes fade-in-bloom {
		0% {
			opacity: 0;
			filter: brightness(1) blur(20px);
		}
		10% {
			opacity: 1;
			filter: brightness(0.5) blur(10px);
		}
		100% {
			opacity: 1;
			filter: brightness(1) blur(0);
		}
	}
}

@media (prefers-color-scheme: dark) {
	@keyframes fade-out-bloom {
		100% {
			opacity: 0;
			filter: brightness(1) blur(20px);
		}
		10% {
			opacity: 1;
			filter: brightness(0.5) blur(10px);
		}
		0% {
			opacity: 1;
			filter: brightness(1) blur(0);
		}
	}
}
```
