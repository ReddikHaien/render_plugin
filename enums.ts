export enum GlEnums{
    FALSE = 0,
    TRUE = 1,
    
    COLOR_BUFFER_BIT        = 0x00004000,
    DEPTH_BUFFER_BIT        = 0x00000100,
    STENCIL_BUFFER_BIT      = 0x00000400,
    BACK                    = 0x0405,
    FRONT                   = 0x0404,
    FRONT_AND_BACK          = 0x0408,
    
    CW                      = 0x0900,
    CCW                     = 0x0901,

    ARRAY_BUFFER            = 0x8892,
    ELEMENT_ARRAY_BUFFER    = 0x8893,

    STREAM_DRAW = 0x88E0,
    STREAM_READ = 0x88E1,
    STREAM_COPY = 0x88E2,
    
    STATIC_DRAW = 0x88E4,
    STATIC_READ = 0x88E5,
    STATIC_COPY = 0x88E6,

    DYNAMIC_DRAW = 0x88E8,
    DYNAMIC_READ = 0x88E9,
    DYNAMIC_COPY = 0x88EA,

    FRAGMENT_SHADER = 0x8B30,
    VERTEX_SHADER = 0x8B31,
    
    SHADER_TYPE = 0x8B4F,
    DELETE_STATUS = 0x8B80,
    COMPILE_STATUS = 0x8B81,

    GEOMETRY_SHADER = 0x8DD9,
}
