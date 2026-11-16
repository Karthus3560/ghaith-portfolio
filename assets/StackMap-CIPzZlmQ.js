import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{a as t,i as n,n as r,t as i}from"./extends-C-OMUFMW.js";import{g as a,t as o}from"./jsx-runtime-B9laz44g.js";import{E as s,Lt as c,U as l,an as u,ar as d,fa as f,io as p,ir as m,jn as h,kt as g,mo as _,no as v,on as y,pn as b,qa as x,ro as S,ta as ee,tr as te}from"./three.core-BF58tRDi.js";import{t as C}from"./three.module-CtreMR9K.js";var w=parseInt(`187`.replace(/\D+/g,``)),T=w>=125?`uv1`:`uv2`,E=new s,D=new S,O=class extends u{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new c([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new c([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new y(t,6,1);return this.setAttribute(`instanceStart`,new b(n,3,0)),this.setAttribute(`instanceEnd`,new b(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new y(n,t*2,1);return this.setAttribute(`instanceColorStart`,new b(r,t,0)),this.setAttribute(`instanceColorEnd`,new b(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new _(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new s);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),E.setFromBufferAttribute(t),this.boundingBox.union(E))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new f),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)D.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(D)),D.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(D));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},k=class extends O{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},A=class extends ee{constructor(e){super({type:`LineMaterial`,uniforms:x.clone(x.merge([C.common,C.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new v(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${w>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},j=new p,M=new S,N=new S,P=new p,F=new p,I=new p,L=new S,R=new m,z=new h,ne=new S,B=new s,V=new f,H=new p,U,W;function G(e,t,n){return H.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),H.multiplyScalar(1/H.w),H.x=W/n.width,H.y=W/n.height,H.applyMatrix4(e.projectionMatrixInverse),H.multiplyScalar(1/H.w),Math.abs(Math.max(H.x,H.y))}function re(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){z.start.fromBufferAttribute(i,r),z.end.fromBufferAttribute(a,r),z.applyMatrix4(n);let o=new S,s=new S;U.distanceSqToSegment(z.start,z.end,s,o),s.distanceTo(o)<W*.5&&t.push({point:s,pointOnLine:o,distance:U.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[T]:null})}}function ie(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;U.at(1,I),I.w=1,I.applyMatrix4(t.matrixWorldInverse),I.applyMatrix4(r),I.multiplyScalar(1/I.w),I.x*=i.x/2,I.y*=i.y/2,I.z=0,L.copy(I),R.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(P.fromBufferAttribute(s,t),F.fromBufferAttribute(c,t),P.w=1,F.w=1,P.applyMatrix4(R),F.applyMatrix4(R),P.z>u&&F.z>u)continue;if(P.z>u){let e=P.z-F.z,t=(P.z-u)/e;P.lerp(F,t)}else if(F.z>u){let e=F.z-P.z,t=(F.z-u)/e;F.lerp(P,t)}P.applyMatrix4(r),F.applyMatrix4(r),P.multiplyScalar(1/P.w),F.multiplyScalar(1/F.w),P.x*=i.x/2,P.y*=i.y/2,F.x*=i.x/2,F.y*=i.y/2,z.start.copy(P),z.start.z=0,z.end.copy(F),z.end.z=0;let o=z.closestPointToPointParameter(L,!0);z.at(o,ne);let l=te.lerp(P.z,F.z,o),d=l>=-1&&l<=1,f=L.distanceTo(ne)<W*.5;if(d&&f){z.start.fromBufferAttribute(s,t),z.end.fromBufferAttribute(c,t),z.start.applyMatrix4(a),z.end.applyMatrix4(a);let r=new S,i=new S;U.distanceSqToSegment(z.start,z.end,i,r),n.push({point:i,pointOnLine:r,distance:U.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[T]:null})}}}var K=class extends d{constructor(e=new O,t=new A({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)M.fromBufferAttribute(t,e),N.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+M.distanceTo(N);let i=new y(r,2,1);return e.setAttribute(`instanceDistanceStart`,new b(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new b(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;U=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;W=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),V.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?W*.5:G(r,Math.max(r.near,V.distanceToPoint(U.origin)),s.resolution),V.radius+=c,U.intersectsSphere(V)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),B.copy(o.boundingBox).applyMatrix4(a);let l;l=n?W*.5:G(r,Math.max(r.near,B.distanceToPoint(U.origin)),s.resolution),B.expandByScalar(l),U.intersectsBox(B)!==!1&&(n?re(this,t):ie(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(j),this.material.uniforms.resolution.value.set(j.z,j.w))}},ae=class extends K{constructor(e=new k,t=new A({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},q=e(a()),oe=q.forwardRef(function({points:e,color:n=16777215,vertexColors:r,linewidth:a,lineWidth:o,segments:s,dashed:c,...u},d){var f;let m=t(e=>e.size),h=q.useMemo(()=>s?new K:new ae,[s]),[g]=q.useState(()=>new A),_=(r==null||(f=r[0])==null?void 0:f.length)===4?4:3,y=q.useMemo(()=>{let t=s?new O:new k,i=e.map(e=>{let t=Array.isArray(e);return e instanceof S||e instanceof p?[e.x,e.y,e.z]:e instanceof v?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(t.setPositions(i.flat()),r){n=16777215;let e=r.map(e=>e instanceof l?e.toArray():e);t.setColors(e.flat(),_)}return t},[e,s,r,_]);return q.useLayoutEffect(()=>{h.computeLineDistances()},[e,h]),q.useLayoutEffect(()=>{c?g.defines.USE_DASH=``:delete g.defines.USE_DASH,g.needsUpdate=!0},[c,g]),q.useEffect(()=>()=>{y.dispose(),g.dispose()},[y]),q.createElement(`primitive`,i({object:h,ref:d},u),q.createElement(`primitive`,{object:y,attach:`geometry`}),q.createElement(`primitive`,i({object:g,attach:`material`,color:n,vertexColors:!!r,resolution:[m.width,m.height],linewidth:a??o??1,dashed:c,transparent:_===4},u)))}),se=q.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let a=q.useRef(null);q.useImperativeHandle(r,()=>a.current,[]);let o=q.useMemo(()=>[0,0,0,1,0,0],[]),s=q.useRef(null),c=q.useRef(null);return q.useLayoutEffect(()=>{let n=a.current.parent,r=t??n?.geometry;if(!r||s.current===r&&c.current===e)return;s.current=r,c.current=e;let i=new g(r,e).attributes.position.array;a.current.geometry.setPositions(i),a.current.geometry.attributes.instanceStart.needsUpdate=!0,a.current.geometry.attributes.instanceEnd.needsUpdate=!0,a.current.computeLineDistances()}),q.createElement(oe,i({segments:!0,points:o,ref:a,raycast:()=>null},n))}),J=o(),Y=3.6,X=.95,Z=1.25,Q=new l(`#12213a`),ce=new l(`#0b6b6b`),le=new l(`#e9edf1`),ue=new l(`#cfe6e3`),de=new l(`#9eabb9`);function fe(e){let t=Math.ceil(Math.sqrt(e)),n=Math.ceil(e/t),r=Math.min(1.05,2.5/Math.max(1,Math.max(t,n)-1||1)),i=[];for(let a=0;a<e;a++){let o=Math.floor(a/t),s=a%t,c=o===n-1?e-t*(n-1):t;i.push([(s-(c-1)/2)*r,(o-(n-1)/2)*r])}return i}function pe({index:e,layer:t,active:r,onActive:i,onLayer:a,onProject:o,label:s,hovered:c,setHovered:l}){let u=(0,q.useRef)(null),d=(0,q.useRef)(null),f=(0,q.useRef)(null),p=(0,q.useMemo)(()=>fe(t.items.length),[t.items.length]),m=r===t.id,h=r!==null&&!m;return n((t,n)=>{let r=1-Math.exp(-n*7);u.current.position.y+=(e*X+(u.current.userData.lift??0)-u.current.position.y)*r,d.current.color.lerp(m?ue:le,r),d.current.opacity+=((m?.92:h?.3:.62)-d.current.opacity)*r;let i=f.current?.material;i&&(i.color.lerp(m?ce:de,r),i.opacity+=((h?.3:1)-i.opacity)*r)}),(0,J.jsxs)(`group`,{ref:u,position:[0,e*X,0],name:t.id,children:[(0,J.jsxs)(`mesh`,{onPointerOver:e=>{e.stopPropagation(),i(t.id)},onPointerOut:()=>i(null),onClick:e=>{e.stopPropagation(),a(t.id)},children:[(0,J.jsx)(`boxGeometry`,{args:[Y,.06,Y]}),(0,J.jsx)(`meshBasicMaterial`,{ref:d,color:le,transparent:!0,opacity:.62,depthWrite:!1}),(0,J.jsx)(se,{ref:f,threshold:15,color:`#9eabb9`,lineWidth:1.3,transparent:!0})]}),t.items.map((e,n)=>(0,J.jsx)(me,{x:p[n][0],z:p[n][1],on:m,dim:h,title:s(e),hovered:c,setHovered:l,id:e.id,onOver:()=>i(t.id),onClick:()=>o(e.id)},e.id))]})}function me({x:e,z:t,on:r,dim:i,title:a,id:o,hovered:s,setHovered:c,onOver:l,onClick:u}){let d=(0,q.useRef)(null),f=(0,q.useRef)(null);return n((e,t)=>{let n=1-Math.exp(-t*9),a=s.current?.id===o,c=a?1.7:1;d.current.scale.x+=(c-d.current.scale.x)*n,d.current.scale.y=d.current.scale.z=d.current.scale.x,f.current.color.lerp(r||a?ce:Q,n),f.current.opacity+=((i?.25:1)-f.current.opacity)*n}),(0,J.jsxs)(`mesh`,{ref:d,position:[e,.12,t],onPointerOver:e=>{e.stopPropagation(),c({id:o,title:a,mesh:d.current}),l(),document.body.style.cursor=`pointer`},onPointerOut:()=>{c(null),document.body.style.cursor=``},onClick:e=>{e.stopPropagation(),u()},children:[(0,J.jsx)(`sphereGeometry`,{args:[.095,20,14]}),(0,J.jsx)(`meshBasicMaterial`,{ref:f,color:Q,transparent:!0})]})}var $=new S;function he(e){let r=(0,q.useRef)(null),i=(0,q.useRef)(null),a=e.tip,{camera:o,size:s,pointer:c}=t(),l=(e.layers.length-1)*X;return n((t,n)=>{let u=e.layers.findIndex(t=>t.id===e.active);r.current.children.forEach((e,t)=>{e.userData.lift=u>=0&&t>u?Z:0});let d=o,f=Math.min(s.width/5.5,s.height/((l+Z)*.883+2.9));Math.abs(d.zoom-f)>.01&&(d.zoom=f,d.updateProjectionMatrix());let p=Math.sin(t.clock.elapsedTime*.25)*.14+c.x*.22;r.current.rotation.y+=(p-r.current.rotation.y)*(1-Math.exp(-n*3));let m=i.current;a.current&&(a.current.style.opacity=m?`1`:`0`,m&&(m.mesh.getWorldPosition($).project(o),a.current.style.transform=`translate(${($.x+1)/2*s.width}px, ${(1-$.y)/2*s.height}px) translate(-50%, -190%)`,a.current.textContent!==m.title&&(a.current.textContent=m.title)))}),(0,J.jsx)(J.Fragment,{children:(0,J.jsx)(`group`,{ref:r,position:[0,-(l+Z)/2,0],children:e.layers.map((t,n)=>(0,J.jsx)(pe,{index:n,layer:t,...e,hovered:i,setHovered:e=>{i.current=e}},t.id))})})}function ge(e){let t=28*Math.PI/180,n=(0,q.useRef)(null);return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(r,{orthographic:!0,dpr:[1,2],gl:{antialias:!0,alpha:!0},camera:{position:[30*Math.cos(t)*Math.SQRT1_2,30*Math.sin(t),30*Math.cos(t)*Math.SQRT1_2],zoom:60,near:.1,far:100},onCreated:({camera:e})=>e.lookAt(0,0,0),onPointerMissed:()=>e.onActive(null),children:(0,J.jsx)(he,{...e,tip:n})}),(0,J.jsx)(`div`,{ref:n,className:`map-tip`})]})}export{ge as default};