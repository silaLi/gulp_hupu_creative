/**
 * @Author   liyang
 * @mail     ly20479293@gmail.com
 */
;var Container = (function() {
    function CacheAPI() { return constructor(); }

    var Cache = {
        Container: {}
    };
    
    CacheAPI.VERSION = '0.1.2';
    CacheAPI.get = get;
    CacheAPI.set = set;
    CacheAPI.directSet = directSet;
    CacheAPI.del = del;
    CacheAPI.inject = inject;
    CacheAPI.wait = inject;
    
    var InjectionManager = InjectionManagerConstructor();

    return CacheAPI
   
    function constructor(serviceName, service) {
        if (service === undefined && typeof serviceName === 'function') {
            servieInject(serviceName)
        } else if (service === undefined) {
            return get(serviceName)
        } else {
            set(serviceName, service)
        }
    }

    function set(serviceName, serviceInit) {
        if (ContainerGet(serviceName) === undefined && typeof serviceInit === 'function') {
            servieInject(serviceName, serviceInit);
        }else if (ContainerGet(serviceName) === undefined) {
            dataObjInject(serviceName, serviceInit)
        }
    }
    function directSet(serviceName, service){
        set(serviceName, function(){ return service});
    }
    function ContainerSet(serviceName, entrance){
       Cache.Container[serviceName] = entrance;
    }

    function get(serviceName) {
        var service = ContainerGet(serviceName);
        if (service === undefined) {
            console.warn(service, 'there is no ' + serviceName);
        }
        // if (typeof service === 'function') {
        //     servieInject(service)
        // }
        return service;
    }
    function ContainerGet(serviceName){
        return Cache.Container[serviceName];
    }
    function ContainerContain(serviceName){
        return Cache.Container.hasOwnProperty(serviceName);
    }
    function del(serviceName){
        ContainerDel(serviceName)
    }
    function ContainerDel(serviceName) {
        delete Cache.Container[serviceName];
    }
    function inject(service){
        servieInject(undefined, service);
    }
    function servieInject(serviceName, serviceInit){
        var service = new Service(serviceName, serviceInit)
        var injection = new Injection();
        injection.setService(service);
        InjectionManager.register(injection);
    }
    function dataObjInject(serviceName, dataObj){
        var service = new Service(serviceName)
        service.dataServiceInject(dataObj)
    }

    function Service(serviceName, serviceInit){
        this.serviceName = serviceName;
        this.serviceInit = serviceInit;

        this.getServiceInit = getServiceInit;
        this.initService = initService;
        this.dataServiceInject = dataServiceInject;

        var self = this;
        function getServiceInit(){
            return self.serviceInit;
        }
        function setEntrance(entrance){
            self.entrance = entrance || null;
        }

        function initService(services){
            var entrance = self.serviceInit.apply(null, services);
            dataServiceInject(entrance)
        }
        function dataServiceInject(data){
            setEntrance(data)
            if (self.serviceName) {
                ContainerSet(self.serviceName, data)
                InjectionManager.injectSignal(self.serviceName);
            }
        }
    }
    function Injection(){
        this.receiver = null;
        this.serviceNameList = [];
        this.services = [];
        this.waitServices = [];

        this.setService = setService;
        this.getWaitServiceList = getWaitServiceList;
        this.injectComplete = injectComplete;
        this.receive = receive;
        this.isEmptyWaitServiceList = isEmptyWaitServiceList;

        var self = this;

        function updateService(receiver){
            receiver = receiver || function(){};
            self.receiver = receiver;
            var serviceRegExp = /[(](.*)[)]/;
            try{
                self.serviceNameList = receiver.toString().match(serviceRegExp)[1].replace(/ /g, '').split(',');
                for (var i = self.serviceNameList.length - 1; i >= 0; i--) {
                    if (self.serviceNameList[i] === '') {
                        self.serviceNameList.splice(i, 1);
                    }
                }
            }catch(e){
                console.error(receiver, 'servie inject error');
            }
            var serviceNameList = self.serviceNameList;
            var services = self.services;
            for (var i = 0, len = serviceNameList.length; i < len; i++) {
                services[i] = ContainerGet(serviceNameList[i]);
                if (!ContainerContain(serviceNameList[i])) {
                    self.waitServices.push({
                        index: i,
                        serviceName: serviceNameList[i],
                        handler: receiver
                    })
                }
            }
        }
        function getWaitServiceList(){
            return self.waitServices;
        }
        function isEmptyWaitServiceList(){
            if (self.waitServices.length === 0) {
                return true;
            }else{
                return false;
            }
        }
        function injectComplete(){
            self.service.initService(self.services);
        }
        function receive(serviceName){
            for (var i = self.waitServices.length - 1; i >= 0; i--) {
                if (self.waitServices[i].serviceName === serviceName) {
                    var service = self.waitServices.splice(i, 1)[0];
                    self.services[service.index] = ContainerGet(serviceName)
                }
            }
        }
        function setService(service){
            self.service = service;
            updateService(service.getServiceInit())
        }
    }

    function InjectionManagerConstructor(){
        var CacheApi = {
            injectSignal: injectSignal,
            register: register
        }
        var Cache = {
            ServiceListener: {}
        }

        return CacheApi;

        function register(injection){
            if (injection.isEmptyWaitServiceList()) {
                injection.injectComplete();
            }else{
                registerInjectionWait(injection);
            }
        }
        function registerInjectionWait(injection){
            var waitServices = injection.waitServices;
            for (var i = waitServices.length - 1; i >= 0; i--) {
                createInjectListener(waitServices[i], injection);
            }
        }
        function createInjectListener(waitService, injection){
            var serviceName = waitService.serviceName;
            var serviceListenerList = Cache.ServiceListener[serviceName] || [];
            
            serviceListenerList.push(injectServiceComplete(waitService, injection))

            Cache.ServiceListener[serviceName] = serviceListenerList;
        }
        function injectServiceComplete(waitService, injection){
            return function(){
                injection.receive(waitService.serviceName);
                if (injection.isEmptyWaitServiceList()) {
                    injection.injectComplete();
                }
            }
        }
        function injectSignal(serviceName){
            var serviceListenerList = Cache.ServiceListener[serviceName] || [];
            while(serviceListenerList.length > 0){
                serviceListenerList.splice(0, 1)[0]()
            }
        }
    }
})();
