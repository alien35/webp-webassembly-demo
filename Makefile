webp.mjs: webp.c
	emcc --no-entry \
    -I libwebp \
    webp.c \
    libwebp/src/{dec,dsp,demux,enc,mux,utils}/*.c -o webp.mjs  \
		-s ENVIRONMENT='web'  \
	  -s SINGLE_FILE=1  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_version", "_create_buffer", "_destroy_buffer", "_encode", "_free_result", "_get_result_pointer", "_get_result_size", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		-O3