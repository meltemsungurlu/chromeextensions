//# sourceURL=@extension-resources-core.js

const ayanoglu={
        utilites :{
                uniqid:function(pre) {
                        return (pre === false ? '' : (pre && pre.length ? (pre + '_') : 'id_')) + ('' + Math.random()).substring(2, 10);
                    }
        }
};
