import time

class INA219:
    def __init__(self, i2c, address=0x40):
        self.i2c = i2c
        self.address = address
        self.i2c.writeto_mem(self.address, 0x00, b'\x39\x9F')

    def get_current_ma(self):
        self.i2c.writeto(self.address, b'\x04')
        data = self.i2c.readfrom(self.address, 2)
        val = int.from_bytes(data, 'big')
        if val > 32767:
            val -= 65536
        return val / 10.0

    def get_bus_voltage_v(self):
        self.i2c.writeto(self.address, b'\x02')
        data = self.i2c.readfrom(self.address, 2)
        val = int.from_bytes(data, 'big')
        return (val >> 3) * 0.004
